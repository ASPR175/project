"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { registerSchema, loginSchema } from "@/validations/auth";

export async function register(data: unknown) {
  const result = registerSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { email, username, password } = result.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (existing) {
    return {
      success: false,
      fieldErrors: {
        email: ["Email or username already taken"],
      },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    await tx.profile.create({
      data: {
        userId: newUser.id,
        displayName: username,
        slug: username,
      },
    });

    return newUser;
  });

  const token = signToken({ userId: user.id });

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { success: true };
}
export async function login(data: unknown) {
  const result = loginSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: { email: ["Invalid email or password"] } };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { error: { email: ["Invalid email or password"] } };
  }

  const token = signToken({ userId: user.id });

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  return { success: true };
}
