"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const bookingSchema = zod_1.default.object({
    userId: zod_1.default.number().int().positive('User ID must be a valid positive integer'),
    groundId: zod_1.default.number().int().positive('Ground ID must be a valid positive integer'),
    slotId: zod_1.default.number().int().positive('Slot ID must be a valid positive integer'),
    date: zod_1.default.date(),
    status: zod_1.default.string().default('pending').refine((status) => ['pending', 'confirmed', 'cancelled'].includes(status), 'Status must be one of: pending, confirmed, cancelled'),
});
const deleteBookingSchema = zod_1.default.object({
    bookingId: zod_1.default.number().int().positive('Booking ID must be a positive integer')
});
exports.bookingValidation = {
    bookingSchema,
    deleteBookingSchema
};
