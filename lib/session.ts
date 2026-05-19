import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      username: true,
      profile: {
        select: {
          slug: true,
          bio: true,
          displayName: true,
          avatarUrl: true,
          links: true,
          isPublic: true,
          // projects: true,
          theme: true,
          projects: {
            orderBy: {
              position: "asc",
            },
          },
        },
      },
    },
  });

  return user;
}
