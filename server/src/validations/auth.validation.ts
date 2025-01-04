import { z } from 'zod';

// Custom password validation function
const passwordValidation = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one digit" })
  .regex(/[@$!%*?&#]/, { message: "Password must contain at least one special character" });

// Validation schemas
const register = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: passwordValidation,
    name: z.string().min(1, { message: "Name is required" }),
  }),
});

const login = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
  }),
});

const logout = z.object({
  body: z.object({
    refreshToken: z.string().min(1, { message: "Refresh token is required" }),
  }),
});

const refreshTokens = z.object({
  body: z.object({
    refreshToken: z.string().min(1, { message: "Refresh token is required" }),
  }),
});

const forgotPassword = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
  }),
});

const resetPassword = z.object({
  query: z.object({
    token: z.string().min(1, { message: "Token is required" }),
  }),
  body: z.object({
    password: passwordValidation,
  }),
});

const verifyEmail = z.object({
  query: z.object({
    token: z.string().min(1, { message: "Token is required" }),
  }),
});

export const authValidation = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
