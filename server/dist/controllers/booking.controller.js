"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const booking_service_1 = require("../services/booking.service");
/**
 * Create a booking
 */
const createBooking = (0, catchAsync_1.default)(async (req, res) => {
    const booking = await booking_service_1.bookingServices.createBooking(req.body);
    res.status(http_status_1.default.CREATED).send(booking);
});
/**
 * Get a booking by ID
 */
const getBookingById = (0, catchAsync_1.default)(async (req, res) => {
    const { bookingId } = req.params;
    if (!bookingId) {
        throw new ApiError_1.default('Booking ID is required', http_status_1.default.BAD_REQUEST);
    }
    const booking = await booking_service_1.bookingServices.getBookingById(Number(bookingId));
    if (!booking) {
        throw new ApiError_1.default('Booking not found', http_status_1.default.NOT_FOUND);
    }
    res.status(http_status_1.default.OK).send(booking);
});
/**
 * Get all bookings
 */
const getAllBookings = (0, catchAsync_1.default)(async (req, res) => {
    const bookings = await booking_service_1.bookingServices.getAllBookings();
    res.status(http_status_1.default.OK).send(bookings);
});
/**
 * Delete a booking
 */
const deleteBooking = (0, catchAsync_1.default)(async (req, res) => {
    const { bookingId } = req.params;
    if (!bookingId) {
        throw new ApiError_1.default('Booking ID is required', http_status_1.default.BAD_REQUEST);
    }
    await booking_service_1.bookingServices.deleteBooking(Number(bookingId));
    res.status(http_status_1.default.NO_CONTENT).send();
});
/**
 * Get bookings for a user
 */
const getUserBookings = (0, catchAsync_1.default)(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        throw new ApiError_1.default('User ID is required', http_status_1.default.BAD_REQUEST);
    }
    const bookings = await booking_service_1.bookingServices.getUserBookings(Number(userId));
    res.status(http_status_1.default.OK).send(bookings);
});
/**
 * Get bookings by ground
 */
const getBookingsByGround = (0, catchAsync_1.default)(async (req, res) => {
    const { groundId } = req.params;
    if (!groundId) {
        throw new ApiError_1.default('Ground ID is required', http_status_1.default.BAD_REQUEST);
    }
    const bookings = await booking_service_1.bookingServices.getBookingsByGround(Number(groundId));
    res.status(http_status_1.default.OK).send(bookings);
});
/**
 * Delete a booking on a ground
 */
const deleteBookingOnGround = (0, catchAsync_1.default)(async (req, res) => {
    const { groundId, bookingId } = req.params;
    if (!groundId || !bookingId) {
        throw new ApiError_1.default('Both Ground ID and Booking ID are required', http_status_1.default.BAD_REQUEST);
    }
    await booking_service_1.bookingServices.deleteBookingOnGround(Number(groundId), Number(bookingId));
    res.status(http_status_1.default.NO_CONTENT).send();
});
/**
 * Export all controllers individually
 */
exports.bookingController = {
    createBooking,
    getBookingById,
    getAllBookings,
    deleteBooking,
    getUserBookings,
    getBookingsByGround,
    deleteBookingOnGround,
};
