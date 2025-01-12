import { z } from 'zod';

 const createGroundSchema = z.object({
  body: z.object({
    groundName: z.string().min(1, 'Ground name is required'),
    location: z.string().min(1, 'Location is required'),
    description: z.string().optional(),
    type: z.string().min(1, 'Type is required'),
    media: z.array(z.string().url('Invalid media URL')).optional(),
    availability: z.boolean().optional(),
  }),
});

 const addSlotsSchema= z.object({
  startHour: z
    .number()
    .int()
    .min(0, 'Start hour must be between 0 and 23')
    .max(23, 'Start hour must be between 0 and 23'),
  endHour: z
    .number()
    .int()
    .min(0, 'End hour must be between 0 and 23')
    .max(23, 'End hour must be between 0 and 23'),
  price: z.number().positive('Price must be positive'),
  duration: z
    .number()
    .int()
    .positive('Duration must be a positive integer')
    .max(24, 'Duration must not exceed 24 hours'),
  recurring: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.endHour <= data.startHour) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'End hour must be greater than start hour',
      path: ['endHour'], // Highlight the specific path causing the issue
    });
  }
});


 const updateGroundSchema = z.object({
  params: z.object({
    groundId: z.string().regex(/^\d+$/, 'Ground ID must be a number'),
  }),
  body: z.object({
    groundName: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    type: z.string().optional(),
    media: z.array(z.string().url('Invalid media URL')).optional(),
    availability: z.boolean().optional(),
  }),
});

 const deleteGroundSchema = z.object({
  params: z.object({
    groundId: z.string().regex(/^\d+$/, 'Ground ID must be a number'),
  }),
});


export const groundValidation = {
  createGroundSchema,
  updateGroundSchema,
  deleteGroundSchema,
  addSlotsSchema
}