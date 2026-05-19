"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import {
  updateProfileSchema,
  createProfileSchema,
} from "@/validations/profile";
import { revalidatePath } from "next/cache";
import { Profile } from "../generated/prisma/client";

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};
export async function updateProfile(
  data: unknown,
): Promise<ActionResponse<Profile>> {
  const parsed = updateProfileSchema.safeParse(data);

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

  const existingProfile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  if (!existingProfile) {
    return { success: false, error: "Profile not found" };
  }

  const { slug } = parsed.data;

  if (slug !== existingProfile.slug) {
    const slugTaken = await prisma.profile.findUnique({
      where: { slug },
    });

    if (slugTaken) {
      return {
        success: false,
        fieldErrors: {
          slug: ["This slug is already taken"],
        },
      };
    }
  }

  const updatedProfile = await prisma.profile.update({
    where: { userId: user.id },
    data: {
      displayName: parsed.data.displayName,
      bio: parsed.data.bio || null,
      avatarUrl: parsed.data.avatarUrl || null,
      theme: parsed.data.theme || null,
      isPublic: parsed.data.isPublic,
      slug: parsed.data.slug,
    },
  });

  revalidatePath(`/u/${existingProfile.slug}`);
  revalidatePath(`/u/${updatedProfile.slug}`);

  return {
    success: true,
    data: updatedProfile,
  };
}

export async function createProfile(
  data: unknown,
): Promise<ActionResponse<Profile>> {
  const parsed = createProfileSchema.safeParse(data);

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

  const existing = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  if (existing) {
    return { success: false, error: "Profile already exists" };
  }

  const slugTaken = await prisma.profile.findUnique({
    where: { slug: parsed.data.slug },
  });

  if (slugTaken) {
    return {
      success: false,
      fieldErrors: {
        slug: ["Slug already taken"],
      },
    };
  }

  const profile = await prisma.profile.create({
    data: {
      userId: user.id,
      displayName: parsed.data.displayName,
      slug: parsed.data.slug,
    },
  });

  revalidatePath(`/u/${profile.slug}`);

  return { success: true, data: profile };
}
