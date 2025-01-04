import { Router } from 'express';

import auth from '../middlewares/auth'; // Your RBAC authentication middleware
import { validateRequest } from '../middlewares/validate';
import { bookingValidation } from '../validations';
import { bookingController } from '../controllers/booking.controller';

const router = Router();

// -- Booking Routes --

// Get all bookings
router.get('/', auth('getUsers'), bookingController.getAllBookings);

router.post(
  '/',
  auth('getUsers'), // 'user' can book
  validateRequest(bookingValidation.bookingSchema), // Validate body data using Zod
  bookingController.createBooking
);
router.get(
  '/:id',
  auth('getUsers'), // 'user' or 'admin' can access
  validateRequest(bookingValidation.deleteBookingSchema), // Validate params
  bookingController.getBookingById
);


// Delete a booking
router.delete(
  '/:id',
  auth('getUsers'), // 'user' or 'admin' can delete bookings
  validateRequest(bookingValidation.deleteBookingSchema), // Validate params
  bookingController.deleteBooking
);
// Get bookings by ground
router.get('/:groundId/bookings', auth('getUsers'), bookingController.getBookingsByGround);

// Delete a booking on a ground
router.delete(
  '/:groundId/bookings/:bookingId',
  auth('getUsers'),
  bookingController.deleteBookingOnGround
);
export default router;
