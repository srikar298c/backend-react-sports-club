"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const http_status_1 = __importDefault(require("http-status"));
const morgan_1 = require("./config/morgan");
const compression_1 = __importDefault(require("compression"));
const routes_1 = __importDefault(require("./routes")); // Import the router
const ApiError_1 = __importDefault(require("./utils/ApiError")); // Custom API Error class
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const config_1 = require("./config/config");
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("./config/passport");
const path_1 = __importDefault(require("path"));
const passportGoogle_1 = require("./config/passportGoogle");
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, '../../frontend/public')));
// Middleware
if (config_1.config.env !== 'test') {
    app.use(morgan_1.successHandler);
    app.use(morgan_1.errorHandler);
} // Logs HTTP requests
app.use((0, helmet_1.default)()); // Secure HTTP headers
const corsOptions = {
    origin: ['http://localhost:3000'], // Replace with the frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow cookies to be sent
};
// Apply CORS middleware with options
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)());
app.use(express_1.default.json()); // Parse JSON request bodies
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use((0, compression_1.default)()); // Compress response bodies
// Routes
app.use('/api', routes_1.default);
app.use((0, express_session_1.default)({
    secret: config_1.config.session.secret, // Use a secure key from the config
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: config_1.config.env === 'production', // Use secure cookies in production
        httpOnly: true, // Prevent client-side access
    },
}));
// jwt authentication
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Setup the JWT strategy
(0, passport_2.setupJwtStrategy)(passport_1.default);
(0, passportGoogle_1.setupGoogleStrategy)(passport_1.default);
// Health check
app.get('/', (req, res) => {
    res.status(http_status_1.default.OK).send({ message: 'API is running' });
});
// Handle 404 errors
app.use((req, res, next) => {
    next(new ApiError_1.default('Not Found', http_status_1.default.NOT_FOUND));
});
// Error handling middleware
app.use(globalErrorHandler_1.default);
exports.default = app;
