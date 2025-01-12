"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const client_1 = require("@prisma/client");
// Load environment variables
dotenv_1.default.config();
const prisma = new client_1.PrismaClient(); // Initialize Prisma Client
const PORT = process.env.PORT || 3000; // Default port
(async () => {
    try {
        // Test database connection
        await prisma.$connect();
        console.log('✅ Connected to the database');
        // Start the server
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to connect to the database:', error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect(); // Ensure proper disconnection on error
    }
})();
