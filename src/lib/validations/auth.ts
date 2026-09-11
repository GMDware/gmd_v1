import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'A valid email address is required' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export type LoginInput = z.infer<typeof loginSchema>;
