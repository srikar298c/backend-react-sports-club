"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
// Define the schema for environment variables using Zod
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['production', 'development', 'test']),
    PORT: zod_1.z.coerce.number().default(4000),
    DATABASE_URL: zod_1.z.string().min(1, 'DATABASE_URL is required'),
    JWT_SECRET: zod_1.z.string().min(1, 'JWT secret key is required'),
    JWT_ACCESS_EXPIRATION_MINUTES: zod_1.z.coerce.number().default(30),
    JWT_REFRESH_EXPIRATION_DAYS: zod_1.z.coerce.number().default(30),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: zod_1.z.coerce.number().default(10),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: zod_1.z.coerce.number().default(10),
    SMTP_HOST: zod_1.z.string().optional(),
    SMTP_PORT: zod_1.z.coerce.number().optional(),
    SMTP_USERNAME: zod_1.z.string().optional(),
    SMTP_PASSWORD: zod_1.z.string().optional(),
    EMAIL_FROM: zod_1.z.string().optional(),
    GOOGLE_CLIENT_ID: zod_1.z.string().min(1, 'Google Client ID is required'),
    GOOGLE_CLIENT_SECRET: zod_1.z.string().min(1, 'Google Client Secret is required'),
    TWILIO_ACCOUNT_SID: zod_1.z.string().min(1, 'Twilio Account SID is required'),
    TWILIO_AUTH_TOKEN: zod_1.z.string().min(1, 'Twilio Auth Token is required'),
});
// Parse and validate environment variables
const envVars = envSchema.parse(process.env);
// Export the validated environment variables and configuration object
exports.config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    appUrl: process.env.APP_URL || `http://localhost:${process.env.PORT || 4000}`,
    prisma: {
        databaseUrl: envVars.DATABASE_URL,
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    },
    email: {
        smtp: {
            host: envVars.SMTP_HOST || '',
            port: envVars.SMTP_PORT || 0,
            auth: {
                user: envVars.SMTP_USERNAME || '',
                pass: envVars.SMTP_PASSWORD || '',
            },
        },
        from: envVars.EMAIL_FROM || '',
    },
    google: {
        clientId: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    },
    twilio: {
        accountSid: envVars.TWILIO_ACCOUNT_SID,
        authToken: envVars.TWILIO_AUTH_TOKEN,
    },
    session: {
        secret: process.env.SESSION_SECRET || 'your_default_secret',
    },
};
