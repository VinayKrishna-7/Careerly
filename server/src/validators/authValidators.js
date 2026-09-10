import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address')
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
    safetyPin: z
      .string({ required_error: 'Safety PIN code is required' })
      .trim()
      .regex(/^\d{4,6}$/, 'Safety PIN must be a 4 to 6 digit numeric code')
      .optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address')
      .toLowerCase(),
    password: z.string({ required_error: 'Password is required' }).min(1, 'Password cannot be empty')
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address')
      .toLowerCase()
  })
});

export const resetPasswordWithPinSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address')
      .toLowerCase(),
    safetyPin: z
      .string({ required_error: 'Safety PIN is required' })
      .trim()
      .regex(/^\d{4,6}$/, 'Safety PIN must be a 4 to 6 digit numeric code'),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(8, 'New password must be at least 8 characters')
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'New password must be at least 6 characters')
  }),
  params: z.object({
    resetToken: z.string({ required_error: 'Reset token is required' })
  })
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(50).optional(),
    avatar: z.string().optional(),
    jobTitle: z.string().optional(),
    safetyPin: z.string().trim().regex(/^\d{4,6}$/).optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6).optional()
  })
});
