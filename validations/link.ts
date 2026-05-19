import { z } from "zod";
import { Platform } from "@/app/generated/prisma/enums";

export const createLinkSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(50),

  url: z.string().trim().url("Invalid URL"),

  platform: z.nativeEnum(Platform),
});

export const updateLinkSchema = z.object({
  id: z.string().cuid(),

  title: z.string().trim().min(1).max(50),

  url: z.string().trim().url(),

  platform: z.nativeEnum(Platform),

  isVisible: z.boolean(),
});

export const deleteLinkSchema = z.object({
  id: z.string().cuid(),
});

export const reorderLinksSchema = z.array(
  z.object({
    id: z.string().cuid(),
    position: z.number().int().min(0),
  }),
);

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
