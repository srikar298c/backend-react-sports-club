import z from "zod";

const bookingSchema = z.object({
  userId: z.number().int().positive('User ID must be a valid positive integer'),
  groundId: z.number().int().positive('Ground ID must be a valid positive integer'),
  slotId: z.number().int().positive('Slot ID must be a valid positive integer'),
  date: z.date(),
  status: z.string().default('pending').refine(
    (status) => ['pending', 'confirmed', 'cancelled'].includes(status),
    'Status must be one of: pending, confirmed, cancelled'
  ),
});
const deleteBookingSchema = z.object({
  bookingId: z.number().int().positive('Booking ID must be a positive integer')
});
export const bookingValidation = {
  bookingSchema,
  deleteBookingSchema
 }