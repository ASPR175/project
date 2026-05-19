"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import {
  createProjectSchema,
  updateProjectSchema,
  deleteProjectSchema,
  reorderProjectsSchema,
} from "@/validations/project";
import { revalidatePath } from "next/cache";
import { Project } from "../generated/prisma/client";

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createProject(
  data: unknown,
): Promise<ActionResponse<Project>> {
  const parsed = createProjectSchema.safeParse(data);

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

  const { skills, ...projectData } = parsed.data;
  const projectCount = await prisma.project.count({
    where: { profileId: profile.id },
  });
  const result = await prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        ...projectData,
        profileId: profile.id,
        position: projectCount,
      },
    });

    if (skills && skills.length > 0) {
      await tx.projectSkill.createMany({
        data: skills.map((s) => ({
          projectId: project.id,
          skillId: s.skillId,
          level: s.level ?? null,
        })),
      });
    }

    return project;
  });
  revalidatePath("/dashboard/projects");
  revalidatePath(`/u/${profile.slug}`);

  return { success: true, data: result };
}

export async function updateProject(
  data: unknown,
): Promise<ActionResponse<Project>> {
  const parsed = updateProjectSchema.safeParse(data);

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

  const project = await prisma.project.findUnique({
    where: { id: parsed.data.id },
    include: {
      profile: {
        select: { userId: true, slug: true },
      },
    },
  });

  if (!project || project.profile.userId !== user.id) {
    return { success: false, error: "Not allowed" };
  }

  const { skills, id, ...projectData } = parsed.data;

  const updated = await prisma.$transaction(async (tx) => {
    const updatedProject = await tx.project.update({
      where: { id },
      data: {
        ...projectData,
      },
    });

    if (skills) {
      await tx.projectSkill.deleteMany({
        where: { projectId: id },
      });

      if (skills.length > 0) {
        await tx.projectSkill.createMany({
          data: skills.map((s) => ({
            projectId: id,
            skillId: s.skillId,
            level: s.level ?? null,
          })),
        });
      }
    }

    return updatedProject;
  });
  revalidatePath("/dashboard/projects");
  revalidatePath(`/u/${project.profile.slug}`);

  return { success: true, data: updated };
}

export async function deleteProject(data: unknown): Promise<ActionResponse> {
  const parsed = deleteProjectSchema.safeParse(data);

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

  const project = await prisma.project.findUnique({
    where: { id: parsed.data.id },
    include: {
      profile: {
        select: { userId: true, slug: true },
      },
    },
  });

  if (!project || project.profile.userId !== user.id) {
    return { success: false, error: "Not allowed" };
  }

  await prisma.project.delete({
    where: { id: project.id },
  });
  revalidatePath("/dashboard/projects");
  revalidatePath(`/u/${project.profile.slug}`);

  return { success: true };
}

export async function reorderProjects(data: unknown): Promise<ActionResponse> {
  const parsed = reorderProjectsSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const projects = await prisma.project.findMany({
    where: {
      id: { in: parsed.data.map((p) => p.id) },
    },
    include: {
      profile: {
        select: { userId: true, slug: true },
      },
    },
  });

  if (projects.length === 0) {
    return { success: false, error: "Projects not found" };
  }

  const slug = projects[0].profile.slug;

  const isOwner = projects.every((p) => p.profile.userId === user.id);

  if (!isOwner) {
    return { success: false, error: "Not allowed" };
  }

  await prisma.$transaction(
    parsed.data.map((item) =>
      prisma.project.update({
        where: { id: item.id },
        data: { position: item.position },
      }),
    ),
  );

  revalidatePath(`/u/${slug}`);

  return { success: true };
}
