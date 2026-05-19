import { z } from "zod";
const themes = ["light", "dark", "midnight"] as const;

export const createProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters")
    .max(50),

  slug: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
});

export const updateProfileSchema = z.object({
  displayName: z.string().trim().min(2).max(50),

  bio: z.string().trim().max(160).optional().or(z.literal("")),

  avatarUrl: z
    .string()
    .trim()
    .url("Invalid avatar URL")
    .optional()
    .or(z.literal("")),

  theme: z.enum(themes).optional(),

  isPublic: z.boolean(),

  slug: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9-]+$/),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
