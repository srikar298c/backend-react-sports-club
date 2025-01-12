"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_1 = require("../middlewares/validate");
const validations_1 = require("../validations");
const booking_controller_1 = require("../controllers/booking.controller");
const router = (0, express_1.Router)();
// -- Booking Routes --
// Get all bookings
router.get('/', 
// auth('getUsers'),
booking_controller_1.bookingController.getAllBookings);
router.post('/', 
// auth('getUsers'), // 'user' can book
(0, validate_1.validateRequest)(validations_1.bookingValidation.bookingSchema), // Validate body data using Zod
booking_controller_1.bookingController.createBooking);
router.get('/:id', 
// auth('getUsers'), // 'user' or 'admin' can access
(0, validate_1.validateRequest)(validations_1.bookingValidation.deleteBookingSchema), // Validate params
booking_controller_1.bookingController.getBookingById);
// Delete a booking
router.delete('/:id', 
// auth('getUsers'), // 'user' or 'admin' can delete bookings
(0, validate_1.validateRequest)(validations_1.bookingValidation.deleteBookingSchema), // Validate params
booking_controller_1.bookingController.deleteBooking);
// Get bookings by ground
router.get('/:groundId/bookings', 
// auth('getUsers'),
booking_controller_1.bookingController.getBookingsByGround);
// Delete a booking on a ground
router.delete('/:groundId/bookings/:bookingId', 
// auth('getUsers'),
booking_controller_1.bookingController.deleteBookingOnGround);
exports.default = router;
