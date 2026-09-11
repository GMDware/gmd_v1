import { z } from 'zod';

export const teamMemberSchema = z.object({
  name: z.string().min(2).max(100),
  displayName: z.string().min(2).max(100),
  isFounder: z.boolean().default(false),
  founderTitle: z.string().max(100).optional().nullable(),
  roleId: z.string().uuid(),
  departmentId: z.string().uuid(),
  shortBio: z.string().min(10).max(500),
  fullBio: z.string().optional().nullable(),
  imageId: z.string().uuid().optional().nullable().or(z.literal('')).transform((val) => (val === '' ? null : val)),
  skills: z.array(z.string()).default([]),
  githubUrl: z.string().url().optional().nullable().or(z.literal('')),
  linkedinUrl: z.string().url().optional().nullable().or(z.literal('')),
  websiteUrl: z.string().url().optional().nullable().or(z.literal('')),
  email: z.string().email().optional().nullable().or(z.literal('')),
  showEmail: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
