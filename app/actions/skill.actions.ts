"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { attachSkillSchema, removeSkillSchema } from "@/validations/skill";
import { revalidatePath } from "next/cache";

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function attachSkillToProject(
  data: unknown,
): Promise<ActionResponse> {
  const parsed = attachSkillSchema.safeParse(data);

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

  const { projectId, skillId, level } = parsed.data;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      profile: {
        select: { userId: true, slug: true },
      },
    },
  });

  if (!project || project.profile.userId !== user.id) {
    return { success: false, error: "Not allowed" };
  }

  const existing = await prisma.projectSkill.findUnique({
    where: {
      projectId_skillId: {
        projectId,
        skillId,
      },
    },
  });

  if (existing) {
    return {
      success: false,
      error: "Skill already attached to this project",
    };
  }

  await prisma.projectSkill.create({
    data: {
      projectId,
      skillId,
      level: level ?? null,
    },
  });

  revalidatePath(`/u/${project.profile.slug}`);

  return { success: true };
}

export async function removeSkillFromProject(
  data: unknown,
): Promise<ActionResponse> {
  const parsed = removeSkillSchema.safeParse(data);

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

  const { projectId, skillId } = parsed.data;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      profile: {
        select: { userId: true, slug: true },
      },
    },
  });

  if (!project || project.profile.userId !== user.id) {
    return { success: false, error: "Not allowed" };
  }

  await prisma.projectSkill.deleteMany({
    where: {
      projectId,
      skillId,
    },
  });

  revalidatePath(`/u/${project.profile.slug}`);

  return { success: true };
}
