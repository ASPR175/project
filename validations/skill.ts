import { z } from "zod";
import { SkillLevel } from "@/app/generated/prisma/enums";

export const attachSkillSchema = z.object({
  projectId: z.string().cuid(),
  skillId: z.string().cuid(),

  level: z.nativeEnum(SkillLevel).optional(),
});

export const removeSkillSchema = z.object({
  projectId: z.string().cuid(),
  skillId: z.string().cuid(),
});

export type AttachSkillInput = z.infer<typeof attachSkillSchema>;
export type RemoveSkillInput = z.infer<typeof removeSkillSchema>;
