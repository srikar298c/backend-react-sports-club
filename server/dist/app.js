"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const client_1 = __importDefault(require("@prisma/client"));
const helmet_1 = __importDefault(require("helmet"));
const globalErrorHandler_1 = require("./middlewares/globalErrorHandler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', routes_1.default);
app.use((0, helmet_1.default)());
app.use(globalErrorHandler_1.errorHandler);
// Add other routes here
// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: err.message,
    });
});
// Gracefully handle shutdown for Prisma client connection
process.on('SIGTERM', async () => {
    await client_1.default.$disconnect();
});
exports.default = app;
