"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groundValidation = void 0;
const zod_1 = require("zod");
const createGroundSchema = zod_1.z.object({
    body: zod_1.z.object({
        groundName: zod_1.z.string().min(1, 'Ground name is required'),
        location: zod_1.z.string().min(1, 'Location is required'),
        description: zod_1.z.string().optional(),
        type: zod_1.z.string().min(1, 'Type is required'),
        media: zod_1.z.array(zod_1.z.string().url('Invalid media URL')).optional(),
        availability: zod_1.z.boolean().optional(),
    }),
});
const addSlotsSchema = zod_1.z.object({
    startHour: zod_1.z
        .number()
        .int()
        .min(0, 'Start hour must be between 0 and 23')
        .max(23, 'Start hour must be between 0 and 23'),
    endHour: zod_1.z
        .number()
        .int()
        .min(0, 'End hour must be between 0 and 23')
        .max(23, 'End hour must be between 0 and 23'),
    price: zod_1.z.number().positive('Price must be positive'),
    duration: zod_1.z
        .number()
        .int()
        .positive('Duration must be a positive integer')
        .max(24, 'Duration must not exceed 24 hours'),
    recurring: zod_1.z.boolean().optional(),
}).superRefine((data, ctx) => {
    if (data.endHour <= data.startHour) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'End hour must be greater than start hour',
            path: ['endHour'], // Highlight the specific path causing the issue
        });
    }
});
const updateGroundSchema = zod_1.z.object({
    params: zod_1.z.object({
        groundId: zod_1.z.string().regex(/^\d+$/, 'Ground ID must be a number'),
    }),
    body: zod_1.z.object({
        groundName: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        type: zod_1.z.string().optional(),
        media: zod_1.z.array(zod_1.z.string().url('Invalid media URL')).optional(),
        availability: zod_1.z.boolean().optional(),
    }),
});
const deleteGroundSchema = zod_1.z.object({
    params: zod_1.z.object({
        groundId: zod_1.z.string().regex(/^\d+$/, 'Ground ID must be a number'),
    }),
});
exports.groundValidation = {
    createGroundSchema,
    updateGroundSchema,
    deleteGroundSchema,
    addSlotsSchema
};
