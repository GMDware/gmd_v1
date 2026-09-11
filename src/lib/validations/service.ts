import { z } from 'zod';

export const serviceSchema = z.object({
  title: z.string().min(2).max(150),
  slug: z.string().min(2).max(150).regex(/^[a-z0-9-]+$/, { message: 'Slug must be alphanumeric with hyphens' }),
  summary: z.string().min(10).max(500),
  content: z.string().min(20),
  iconName: z.string().max(50).optional().nullable(),
  heroImageId: z.string().uuid().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  displayOrder: z.number().int().default(0),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  seoTitle: z.string().max(200).optional().nullable(),
  seoDescription: z.string().max(500).optional().nullable(),
  features: z.array(
    z.object({
      title: z.string().min(2).max(150),
      description: z.string().min(5).max(1000),
      displayOrder: z.number().int().optional(),
    })
  ).default([]),
  technologyIds: z.array(z.string().uuid()).default([]),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
