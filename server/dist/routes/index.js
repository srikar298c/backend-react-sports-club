"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./auth.route")); // Update this with the actual file path
const user_routes_1 = __importDefault(require("./user.routes")); // Update this with the actual file path
const ground_route_1 = __importDefault(require("./ground.route")); // Import the Ground routes
const booking_route_1 = __importDefault(require("./booking.route")); // Import the Booking routes
const router = express_1.default.Router();
const defaultRoutes = [
    {
        path: '/auth',
        route: auth_route_1.default,
    },
    {
        path: '/users',
        route: user_routes_1.default,
    },
    {
        path: '/grounds', // Mount the Ground routes
        route: ground_route_1.default,
    },
    {
        path: '/bookings', // Mount the Booking routes
        route: booking_route_1.default,
    },
];
defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
