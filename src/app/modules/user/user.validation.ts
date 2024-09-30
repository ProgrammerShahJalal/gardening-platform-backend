import { z } from 'zod';

export const userSignUpValidationSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(20),
  phone: z.string().min(10).max(15),
  address: z.string().min(5).max(100),
  securityAnswers: z.array(z.string().min(2).max(100)).length(2), // Require 2 answers
  role: z.enum(['user', 'admin']),
});

export const userLoginValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Password recovery validation schema
export const userRecoverPasswordValidationSchema = z.object({
  email: z.string().email(),
  answer1: z.string().min(2),
  answer2: z.string().min(2),
});

// Password change validation schema
export const userChangePasswordValidationSchema = z.object({
  email: z.string().email(),
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6).max(20),
});
