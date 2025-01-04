import { z } from 'zod';

// Custom validation for numeric ID (kept as a string for compatibility with ZodObject)
const numericId = z.string().regex(/^\d+$/, "User ID must be a numeric string");
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long.')
  .max(128, 'Password must be no longer than 128 characters.')
  .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter.')
  .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter.')
  .regex(/(?=.*\d)/, 'Password must contain at least one number.');

export const userValidation = {
  createUser: z.object({
    body: z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email address"),
      password: passwordSchema,
  role: z.enum(['user', 'admin']).optional(),
    }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided.',
  })
  }),

  getUsers: z.object({
    query: z.object({
      name: z.string().optional(),
      role: z.string().optional(),
      sortBy: z.string().optional(),
      limit: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : undefined))
        .refine((val) => val === undefined || val > 0, {
          message: "Limit must be a positive integer",
        }),
      page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : undefined))
        .refine((val) => val === undefined || val > 0, {
          message: "Page must be a positive integer",
        }),
    }),
  }),

  getUser: z.object({
    params: z.object({
      userId: numericId, // Kept as string for middleware compatibility
    }),
  }),

  updateUser: z.object({
    params: z.object({
      userId: numericId, // Kept as string for middleware compatibility
    }),
    body: z
      .object({
        name: z.string().optional(),
        email: z.string().email("Invalid email address").optional(),
       password: passwordSchema.optional(),
    role: z.enum(['user', 'admin']).optional(),
    isEmailVerified: z.boolean().optional(),
      })
      .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be updated",
        path: ["body"],
      }),
  }),

  deleteUser: z.object({
    params: z.object({
      userId: numericId, // Kept as string for middleware compatibility
    }),
  }),
};
