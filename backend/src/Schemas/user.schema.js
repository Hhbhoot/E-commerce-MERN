import { email, z } from 'zod';

export const registerSchema = z.object({
  fullName: z
    .string({ message: 'Full name is required' })
    .min(3, { message: 'Full name is required' })
    .max(50, { message: 'Full name is too long' }),

  email: z.email({ message: 'Email is required' }).toLowerCase(),

  password: z.string({ message: 'Password is required' }),

  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  role: z.enum(['Customer', 'Seller']).default('Customer'),

  addresses: z
    .array(
      z.object({
        fullName: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
      }),
    )
    .optional(),
});

export const loginSchema = z.object({
  email: z.string({ message: 'Email is required' }),
  password: z.string({ message: 'Password is required' }),
});

export const updateProfileSchema = registerSchema.partial();
