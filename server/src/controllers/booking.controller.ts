import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import { bookingServices } from '../services/booking.service';

/**
 * Create a booking
 */
const createBooking = catchAsync(async (req, res) => {
  const booking = await bookingServices.createBooking(req.body);
  res.status(httpStatus.CREATED).send(booking);
});

/**
 * Get a booking by ID
 */
const getBookingById = catchAsync(async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    throw new ApiError('Booking ID is required', httpStatus.BAD_REQUEST);
  }

  const booking = await bookingServices.getBookingById(Number(bookingId));

  if (!booking) {
    throw new ApiError('Booking not found', httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).send(booking);
});

/**
 * Get all bookings
 */
const getAllBookings = catchAsync(async (req, res) => {
  const bookings = await bookingServices.getAllBookings();
  res.status(httpStatus.OK).send(bookings);
});

/**
 * Delete a booking
 */
const deleteBooking = catchAsync(async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    throw new ApiError('Booking ID is required', httpStatus.BAD_REQUEST);
  }

  await bookingServices.deleteBooking(Number(bookingId));
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Get bookings for a user
 */
const getUserBookings = catchAsync(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError('User ID is required', httpStatus.BAD_REQUEST);
  }

  const bookings = await bookingServices.getUserBookings(Number(userId));
  res.status(httpStatus.OK).send(bookings);
});

/**
 * Get bookings by ground
 */
const getBookingsByGround = catchAsync(async (req, res) => {
  const { groundId } = req.params;

  if (!groundId) {
    throw new ApiError('Ground ID is required', httpStatus.BAD_REQUEST);
  }

  const bookings = await bookingServices.getBookingsByGround(Number(groundId));
  res.status(httpStatus.OK).send(bookings);
});

/**
 * Delete a booking on a ground
 */
const deleteBookingOnGround = catchAsync(async (req, res) => {
  const { groundId, bookingId } = req.params;

  if (!groundId || !bookingId) {
    throw new ApiError('Both Ground ID and Booking ID are required', httpStatus.BAD_REQUEST);
  }

  await bookingServices.deleteBookingOnGround(Number(groundId), Number(bookingId));
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Export all controllers individually
 */
export const bookingController = {
  createBooking,
  getBookingById,
  getAllBookings,
  deleteBooking,
  getUserBookings,
  getBookingsByGround,
  deleteBookingOnGround,
};
