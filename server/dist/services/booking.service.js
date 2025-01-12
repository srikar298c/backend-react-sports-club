"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingServices = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Create a booking
 */
const createBooking = async (data) => {
    const { userId, groundId, slotId, date } = data;
    // Check if the slot is already booked
    const existingBooking = await prisma.booking.findFirst({
        where: { groundId, slotId, date: new Date(date) },
    });
    if (existingBooking) {
        throw new Error('Slot is already booked');
    }
    return await prisma.booking.create({
        data: {
            userId,
            groundId,
            slotId,
            date: new Date(date),
        },
    });
};
/**
 * Get a booking by ID
 */
const getBookingById = async (bookingId) => {
    return await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            ground: true,
            slot: true,
            user: true,
        },
    });
};
/**
 * Get all bookings
 */
const getAllBookings = async () => {
    return await prisma.booking.findMany({
        include: {
            ground: true,
            slot: true,
            user: true,
        },
    });
};
/**
 * Delete a booking
 */
const deleteBooking = async (bookingId) => {
    return await prisma.booking.delete({
        where: { id: bookingId },
    });
};
/**
 * Get bookings for a user
 */
const getUserBookings = async (userId) => {
    return await prisma.booking.findMany({
        where: { userId },
        include: {
            ground: true,
            slot: true,
        },
    });
};
const getBookingsByGround = async (groundId) => {
    return await prisma.booking.findMany({
        where: { groundId },
        include: {
            user: true,
            slot: true,
            ground: true,
        },
    });
};
const deleteBookingOnGround = async (groundId, bookingId) => {
    // Verify the booking belongs to the specified ground
    const booking = await prisma.booking.findFirst({
        where: {
            id: bookingId,
            groundId,
        },
    });
    if (!booking) {
        throw new Error('Booking not found for the specified ground');
    }
    return await prisma.booking.delete({
        where: { id: bookingId },
    });
};
exports.bookingServices = {
    createBooking,
    getBookingById,
    getAllBookings,
    deleteBooking,
    getUserBookings,
    getBookingsByGround,
    deleteBookingOnGround,
};
