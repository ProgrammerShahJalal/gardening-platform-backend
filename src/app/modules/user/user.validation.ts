import { z } from 'zod';

export const userSignUpValidationSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(20),
  phone: z.string().min(10).max(15),
  address: z.string().min(5).max(100),
  role: z.enum(['user', 'admin']),
});

export const userLoginValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Password recovery validation schema
export const userRecoverPasswordValidationSchema = z.object({
  email: z.string().email(), // Email must be a valid email
});

// Password reset validation schema
export const userResetPasswordValidationSchema = z.object({
  token: z.string(), // Token from the recovery email
  newPassword: z.string().min(6).max(20),
});
