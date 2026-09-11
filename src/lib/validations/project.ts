import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }).max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/, { message: 'Slug must be alphanumeric with hyphens' }),
  shortDescription: z.string().min(10).max(500),
  fullDescription: z.string().min(20),
  categoryId: z.string().uuid({ message: 'Valid category is required' }),
  clientName: z.string().optional(),
  clientVisibility: z.boolean().default(false),
  projectType: z.string().min(2).max(100),
  heroImageId: z.string().uuid().optional().nullable(),
  challenge: z.string().optional(),
  strategy: z.string().optional(),
  uxApproach: z.string().optional(),
  uiApproach: z.string().optional(),
  architecture: z.string().optional(),
  development: z.string().optional(),
  infrastructure: z.string().optional(),
  results: z.string().optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  displayOrder: z.number().int().default(0),
  technologyIds: z.array(z.string()).default([]),
});

export type ProjectInput = z.infer<typeof projectSchema>;
