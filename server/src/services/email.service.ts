import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { config } from '../config/config';
import logger from '../config/logger';

let transport: Transporter | null = null;

/**
 * Initialize email transporter
 */
const initializeTransporter = (): Transporter => {
  try {
    const transporter = nodemailer.createTransport(config.email.smtp);
    logger.info('Email transporter initialized');
    return transporter;
  } catch (error) {
    logger.error('Failed to initialize email transporter', { error });
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
const verifyEmailServer = async (): Promise<void> => {
  if (!transport) {
    logger.error('Transporter is not initialized');
    return;
  }

  try {
    await transport.verify();
    logger.info('Connected to email server');
  } catch (error) {
    logger.warn(
      'Unable to connect to email server. Ensure SMTP options are properly configured in .env',
      { error }
    );
  }
};

// Verify the email server only in non-test environments
if (config.env !== 'test') {
  verifyEmailServer();
}

/**
 * Send an email using the configured transport
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param text - Email body
 * @returns Promise<void>
 */
const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  if (!transport) {
    throw new Error('Transporter is not initialized');
  }

  try {
    const msg: SendMailOptions = {
      from: config.email.from,
      to,
      subject,
      text,
    };

    await transport.sendMail(msg);
    logger.info(`Email sent successfully to ${to} with subject: ${subject}`);
  } catch (error) {
    logger.error(`Failed to send email to ${to} with subject: ${subject}`, { error });
    throw new Error('Email could not be sent');
  }
};

/**
 * Send reset password email
 * @param to - Recipient email address
 * @param token - Reset password token
 * @returns Promise<void>
 */
const sendResetPasswordEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Reset Password';
  const resetPasswordUrl = `${config.appUrl}/reset-password?token=${token}`;
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
const sendVerificationEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Email Verification';
  const verificationEmailUrl = `${config.appUrl}/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, please ignore this email.`;

  await sendEmail(to, subject, text);
};

export const emailService = {
  transport,
  verifyEmailServer,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
