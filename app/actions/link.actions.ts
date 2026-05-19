"use server";

import prisma from "@/lib/prisma";
import { Link } from "../generated/prisma/client";
import { getCurrentUser } from "@/lib/session";
import {
  createLinkSchema,
  updateLinkSchema,
  deleteLinkSchema,
  reorderLinksSchema,
} from "@/validations/link";
import { revalidatePath } from "next/cache";

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createLink(data: unknown): Promise<ActionResponse<Link>> {
  const parsed = createLinkSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { id: true, slug: true },
  });

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  const link = await prisma.link.create({
    data: {
      ...parsed.data,
      profileId: profile.id,
    },
  });

  revalidatePath(`/u/${profile.slug}`);

  return { success: true, data: link };
}

export async function updateLink(data: unknown): Promise<ActionResponse<Link>> {
  const parsed = updateLinkSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const link = await prisma.link.findUnique({
    where: { id: parsed.data.id },
    include: {
      profile: {
        select: { userId: true, slug: true },
      },
    },
  });

  if (!link || link.profile.userId !== user.id) {
    return { success: false, error: "Not allowed" };
  }

  const updated = await prisma.link.update({
    where: { id: link.id },
    data: {
      title: parsed.data.title,
      url: parsed.data.url,
      platform: parsed.data.platform,
      isVisible: parsed.data.isVisible,
    },
  });

  revalidatePath(`/u/${link.profile.slug}`);

  return { success: true, data: updated };
}

export async function deleteLink(data: unknown): Promise<ActionResponse> {
  const parsed = deleteLinkSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const link = await prisma.link.findUnique({
    where: { id: parsed.data.id },
    include: {
      profile: {
        select: { userId: true, slug: true },
      },
    },
  });

  if (!link || link.profile.userId !== user.id) {
    return { success: false, error: "Not allowed" };
  }

  await prisma.link.delete({
    where: { id: link.id },
  });

  revalidatePath(`/u/${link.profile.slug}`);

  return { success: true };
}

export async function reorderLinks(
  data: unknown,
): Promise<ActionResponse<any>> {
  const parsed = reorderLinksSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const links = await prisma.link.findMany({
    where: {
      id: { in: parsed.data.map((l) => l.id) },
    },
    include: {
      profile: {
        select: { userId: true, slug: true },
      },
    },
  });

  if (links.length === 0) {
    return { success: false, error: "Links not found" };
  }

  const slug = links[0].profile.slug;

  const isOwner = links.every((l) => l.profile.userId === user.id);

  if (!isOwner) {
    return { success: false, error: "Not allowed" };
  }

  await prisma.$transaction(
    parsed.data.map((item) =>
      prisma.link.update({
        where: { id: item.id },
        data: { position: item.position },
      }),
    ),
  );

  revalidatePath(`/u/${slug}`);

  return { success: true };
}
