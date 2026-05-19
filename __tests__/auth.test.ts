import { describe, it, expect, vi, beforeEach } from "vitest";
import { register, login, logout } from "@/app/actions/auth.actions";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const { mockSet, mockDelete } = vi.hoisted(() => ({
  mockSet: vi.fn(),
  mockDelete: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    set: mockSet,
    delete: mockDelete,
  }),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password"),
    compare: vi.fn(),
  },
}));

vi.mock("@/lib/auth", () => ({
  signToken: vi.fn().mockReturnValue("mocked_jwt_token"),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Auth Server Actions", () => {
  describe("register", () => {
    it("creates user and sets cookie successfully with valid data", async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValue(null);

      vi.mocked(prisma.$transaction).mockImplementation(async (callback) =>
        callback({
          user: { create: vi.fn().mockResolvedValue({ id: "new-user-id" }) },
          profile: { create: vi.fn().mockResolvedValue({}) },
        } as any),
      );

      const result = await register({
        email: "new@email.com",
        username: "newuser",
        password: "password123",
      });

      expect(result.success).toBe(true);
      expect(mockSet).toHaveBeenCalledWith(
        "token",
        "mocked_jwt_token",
        expect.any(Object),
      );
    });
  });

  describe("login", () => {
    it("returns error if password is wrong", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-id",
        email: "user@email.com",
        username: "user",
        password: "hashed_password",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      const result = await login({
        email: "user@email.com",
        password: "wrongpassword",
      });

      expect(result.error).toBeDefined();
      expect(result.error?.email).toContain("Invalid email or password");
    });

    it("returns success with correct credentials", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-id",
        email: "user@email.com",
        username: "user",
        password: "hashed_password",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      const result = await login({
        email: "user@email.com",
        password: "correctpassword",
      });

      expect(result.success).toBe(true);

      expect(mockSet).toHaveBeenCalledWith(
        "token",
        "mocked_jwt_token",
        expect.any(Object),
      );
    });
  });

  describe("logout", () => {
    it("deletes the auth token cookie", async () => {
      const result = await logout();

      expect(result.success).toBe(true);
      expect(mockDelete).toHaveBeenCalledWith("token");
    });
  });
});
