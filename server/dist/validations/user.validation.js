"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
// Custom validation for numeric ID (kept as a string for compatibility with ZodObject)
const numericId = zod_1.z.string().regex(/^\d+$/, "User ID must be a numeric string");
const passwordSchema = zod_1.z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .max(128, 'Password must be no longer than 128 characters.')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter.')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter.')
    .regex(/(?=.*\d)/, 'Password must contain at least one number.');
exports.userValidation = {
    createUser: zod_1.z.object({
        body: zod_1.z.object({
            name: zod_1.z.string().min(1, "Name is required"),
            email: zod_1.z.string().email("Invalid email address"),
            password: passwordSchema,
            role: zod_1.z.enum(['user', 'admin', 'super admin']).optional(),
        }).refine((data) => Object.keys(data).length > 0, {
            message: 'At least one field must be provided.',
        })
    }),
    getUsers: zod_1.z.object({
        query: zod_1.z.object({
            name: zod_1.z.string().optional(),
            role: zod_1.z.string().optional(),
            sortBy: zod_1.z.string().optional(),
            limit: zod_1.z
                .string()
                .optional()
                .transform((val) => (val ? parseInt(val, 10) : undefined))
                .refine((val) => val === undefined || val > 0, {
                message: "Limit must be a positive integer",
            }),
            page: zod_1.z
                .string()
                .optional()
                .transform((val) => (val ? parseInt(val, 10) : undefined))
                .refine((val) => val === undefined || val > 0, {
                message: "Page must be a positive integer",
            }),
        }),
    }),
    getUser: zod_1.z.object({
        params: zod_1.z.object({
            userId: numericId, // Kept as string for middleware compatibility
        }),
    }),
    updateUser: zod_1.z.object({
        params: zod_1.z.object({
            userId: numericId, // Kept as string for middleware compatibility
        }),
        body: zod_1.z
            .object({
            name: zod_1.z.string().optional(),
            email: zod_1.z.string().email("Invalid email address").optional(),
            password: passwordSchema.optional(),
            role: zod_1.z.enum(['user', 'admin', 'super admin']).optional(),
            isEmailVerified: zod_1.z.boolean().optional(),
        })
            .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be updated",
            path: ["body"],
        }),
    }),
    deleteUser: zod_1.z.object({
        params: zod_1.z.object({
            userId: numericId, // Kept as string for middleware compatibility
        }),
    }),
};
