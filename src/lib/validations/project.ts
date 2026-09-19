import { z } from 'zod';

export const projectSchema = z
  .object({
    title: z.string().min(1, { message: 'Title is required' }).max(200),
    slug: z.string().min(1, { message: 'Slug is required' }).max(200),
    shortDescription: z.string().optional().nullable().transform((val) => val ?? ''),
    fullDescription: z.string().optional().nullable().transform((val) => val ?? ''),
    categoryId: z.string().min(1, { message: 'Valid category is required' }),
    clientName: z.string().optional().nullable(),
    clientVisibility: z.boolean().optional().default(false),
    projectType: z
      .string()
      .optional()
      .nullable()
      .transform((val) => val || 'Enterprise Web Platform')
      .default('Enterprise Web Platform'),
    heroImageId: z.string().optional().nullable().or(z.literal('')).transform((val) => (val === '' ? null : val)),
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
    seoKeywords: z.array(z.string()).optional().default([]),
    isFeatured: z.boolean().optional().default(false),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional().default('DRAFT'),
    displayOrder: z.coerce.number().int().optional().default(0),
    technologyIds: z.array(z.string()).optional().default([]),
    caseStudy: z.any().optional().nullable(),
  })
  .passthrough();

export type ProjectInput = z.infer<typeof projectSchema>;
