import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, { message: 'Slug must be alphanumeric with hyphens' }),
  shortDescription: z.string().min(3, { message: 'Short description must be at least 3 characters' }).max(1000),
  fullDescription: z.string().min(3, { message: 'Full description must be at least 3 characters' }),
  categoryId: z.string().uuid({ message: 'Valid category is required' }),
  clientName: z.string().optional().nullable(),
  clientVisibility: z.boolean().default(false),
  projectType: z.string().min(2).max(100),
  heroImageId: z.string().uuid().optional().nullable().or(z.literal('')).transform((val) => (val === '' ? null : val)),
  challenge: z.string().optional().nullable(),
  strategy: z.string().optional().nullable(),
  uxApproach: z.string().optional().nullable(),
  uiApproach: z.string().optional().nullable(),
  designApproach: z.string().optional().nullable(),
  architecture: z.string().optional().nullable(),
  development: z.string().optional().nullable(),
  infrastructure: z.string().optional().nullable(),
  results: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoKeywords: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  displayOrder: z.number().int().default(0),
  technologyIds: z.array(z.string()).default([]),
  caseStudy: z
    .object({
      summary: z.string().optional(),
      metrics: z.any().optional(),
      testimonial: z.any().optional(),
    })
    .optional()
    .nullable(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
