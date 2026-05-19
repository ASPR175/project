import { z } from "zod";
import { SkillLevel } from "@/app/generated/prisma/enums";

export const createProjectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100),

  description: z.string().trim().max(500).optional().or(z.literal("")),

  repoUrl: z.string().url().optional().or(z.literal("")),

  liveUrl: z.string().url().optional().or(z.literal("")),

  imageUrl: z.string().url().optional().or(z.literal("")),

  techStack: z
    .array(z.string().trim().min(1))
    .min(1, "At least one tech stack item is required")
    .max(20),

  skills: z
    .array(
      z.object({
        skillId: z.string().cuid(),
        level: z.nativeEnum(SkillLevel).optional(),
      }),
    )
    .optional(),

  position: z.number().int().min(0).optional(),
});

export const updateProjectSchema = createProjectSchema.extend({
  id: z.string().cuid(),
});

export const deleteProjectSchema = z.object({
  id: z.string().cuid(),
});

export const reorderProjectsSchema = z.array(
  z.object({
    id: z.string().cuid(),
    position: z.number().int().min(0),
  }),
);

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>;
