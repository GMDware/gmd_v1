import { z } from 'zod';

export const contactSubmissionSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }).max(100),
  email: z.string().email({ message: 'Valid corporate email address is required' }),
  phone: z
    .string()
    .max(30, { message: 'Phone number cannot exceed 30 characters' })
    .regex(/^[+]?[\d\s\-().]{6,30}$/, { message: 'Please enter a valid phone number' })
    .optional()
    .nullable()
    .or(z.literal(''))
    .transform((val) => (val === '' ? null : val)),
  companyName: z.string().max(100).optional(),
  projectType: z.string().max(100).optional(),
  budgetRange: z.string().max(100).optional(),
  timeline: z.string().max(100).optional(),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }).max(5000),
  intakeRoute: z.string().max(100).optional(),
  routingTag: z.string().max(100).optional(),
});

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;
