import { z } from 'zod';

const strictPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter (A-Z)')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter (a-z)')
  .regex(/[0-9]/, 'Password must contain at least one number (0-9)')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character (!@#$%^&*...)');

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Full name must be at least 2 characters').max(50, 'Name is too long'),
    email: z.string().email('Please enter a valid email address'),
    password: strictPasswordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    safetyPin: z
      .string()
      .regex(/^\d{4,6}$/, 'Safety PIN must be a 4 to 6 digit number (e.g. 1234, 987654)')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match. Please re-enter identical passwords.',
    path: ['confirmPassword']
  });

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const resetWithPinSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    safetyPin: z
      .string()
      .regex(/^\d{4,6}$/, 'Safety PIN must be a 4 to 6 digit numeric code'),
    newPassword: strictPasswordSchema,
    confirmNewPassword: z.string().min(1, 'Please confirm your new password')
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match. Please re-enter identical passwords.',
    path: ['confirmNewPassword']
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

export const resetPasswordSchema = z
  .object({
    password: strictPasswordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match. Please re-enter identical passwords.',
    path: ['confirmPassword']
  });

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  jobTitle: z.string().max(80).optional(),
  avatar: z.string().optional(),
  safetyPin: z.string().regex(/^\d{4,6}$/, 'Safety PIN must be a 4 to 6 digit number').optional().or(z.literal('')),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').optional().or(z.literal(''))
});
