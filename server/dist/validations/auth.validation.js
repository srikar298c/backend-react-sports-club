"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const zod_1 = require("zod");
// Custom password validation function
const passwordValidation = zod_1.z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one digit" })
    .regex(/[@$!%*?&#]/, { message: "Password must contain at least one special character" });
// Validation schemas
const register = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email({ message: "Invalid email address" }),
        password: passwordValidation,
        name: zod_1.z.string().min(1, { message: "Name is required" }),
    }),
});
const login = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email({ message: "Invalid email address" }),
        password: zod_1.z.string().min(1, { message: "Password is required" }),
    }),
});
const logout = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1, { message: "Refresh token is required" }),
    }),
});
const refreshTokens = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1, { message: "Refresh token is required" }),
    }),
});
const forgotPassword = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email({ message: "Invalid email address" }),
    }),
});
const resetPassword = zod_1.z.object({
    query: zod_1.z.object({
        token: zod_1.z.string().min(1, { message: "Token is required" }),
    }),
    body: zod_1.z.object({
        password: passwordValidation,
    }),
});
const verifyEmail = zod_1.z.object({
    query: zod_1.z.object({
        token: zod_1.z.string().min(1, { message: "Token is required" }),
    }),
});
exports.authValidation = {
    register,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    verifyEmail,
};
