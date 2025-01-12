"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config/config");
const logger_1 = __importDefault(require("../config/logger"));
let transport = null;
/**
 * Initialize email transporter
 */
const initializeTransporter = () => {
    try {
        const transporter = nodemailer_1.default.createTransport(config_1.config.email.smtp);
        logger_1.default.info('Email transporter initialized');
        return transporter;
    }
    catch (error) {
        logger_1.default.error('Failed to initialize email transporter', { error });
        throw new Error('Failed to initialize email transporter');
    }
};
// Lazily initialize the transporter to avoid issues with initialization order
if (!transport) {
    transport = initializeTransporter();
}
/**
 * Verify the connection to the email server
 * Logs the success or failure of the connection
 */
const verifyEmailServer = async () => {
    if (!transport) {
        logger_1.default.error('Transporter is not initialized');
        return;
    }
    try {
        await transport.verify();
        logger_1.default.info('Connected to email server');
    }
    catch (error) {
        logger_1.default.warn('Unable to connect to email server. Ensure SMTP options are properly configured in .env', { error });
    }
};
// Verify the email server only in non-test environments
if (config_1.config.env !== 'test') {
    verifyEmailServer();
}
/**
 * Send an email using the configured transport
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param text - Email body
 * @returns Promise<void>
 */
const sendEmail = async (to, subject, text) => {
    if (!transport) {
        throw new Error('Transporter is not initialized');
    }
    try {
        const msg = {
            from: config_1.config.email.from,
            to,
            subject,
            text,
        };
        await transport.sendMail(msg);
        logger_1.default.info(`Email sent successfully to ${to} with subject: ${subject}`);
    }
    catch (error) {
        logger_1.default.error(`Failed to send email to ${to} with subject: ${subject}`, { error });
        throw new Error('Email could not be sent');
    }
};
/**
 * Send reset password email
 * @param to - Recipient email address
 * @param token - Reset password token
 * @returns Promise<void>
 */
const sendResetPasswordEmail = async (to, token) => {
    const subject = 'Reset Password';
    const resetPasswordUrl = `${config_1.config.appUrl}/reset-password?token=${token}`;
    const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request a password reset, please ignore this email.`;
    await sendEmail(to, subject, text);
};
/**
 * Send verification email
 * @param to - Recipient email address
 * @param token - Email verification token
 * @returns Promise<void>
 */
const sendVerificationEmail = async (to, token) => {
    const subject = 'Email Verification';
    const verificationEmailUrl = `${config_1.config.appUrl}/verify-email?token=${token}`;
    const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, please ignore this email.`;
    await sendEmail(to, subject, text);
};
exports.emailService = {
    transport,
    verifyEmailServer,
    sendEmail,
    sendResetPasswordEmail,
    sendVerificationEmail,
};
