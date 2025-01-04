import express from 'express';
import authRoutes from './auth.route'; // Update this with the actual file path
import userRoutes from './user.routes'; // Update this with the actual file path
import groundRoutes from './ground.route'; // Import the Ground routes
import bookingRoutes from './booking.route'; // Import the Booking routes

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/grounds', // Mount the Ground routes
    route: groundRoutes,
  },
  {
    path: '/bookings', // Mount the Booking routes
    route: bookingRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
