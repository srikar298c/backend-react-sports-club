import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import httpStatus from 'http-status';
import { config } from '../config/config';
import { userService } from '../services';
import { TokenModel } from '../models';
import ApiError from '../utils/ApiError';
import { TokenTypes } from '../config/token';
import { Token } from '@prisma/client';

interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
  type: TokenTypes;
  role?: string;
}

interface AuthTokens {
  access: {
    token: string;
    expiresAt: Date;
  };
  refresh: {
    token: string;
    expiresAt: Date;
  };
}


const generateToken = (
  userId: string,
  expiresAt: Moment,
  type: TokenTypes,
   role?: string,
  secret: string = config.jwt.secret
): string => {
  const payload: TokenPayload = {
    sub: userId,
    iat: moment().unix(),
    exp: expiresAt.unix(),
    type,
    role,
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (
  token: string,
  userId: string,
  expiresAt: Moment,
  type: TokenTypes,
    role?: string,
  isBlacklisted: boolean = false
): Promise<Token> => {
  return await TokenModel.createToken({
    userId: Number(userId),
    token,
    type,
    expiresAt: expiresAt.toDate(),
    isBlacklisted,
    role,
  });
};

const verifyToken = async (
  token: string,
  type: TokenTypes,
   requiredRole?: string
): Promise<Token> => {
  try {
    const payload = jwt.verify(token, config.jwt.secret) as TokenPayload;
    const tokenDoc = await TokenModel.getTokenByUserAndType(
      Number(payload.sub),
      type,
      requiredRole
    );

    if (!tokenDoc || tokenDoc.isBlacklisted) {
      throw new ApiError('Invalid or expired token', httpStatus.UNAUTHORIZED);
    }
     // Verify role if required
    if (requiredRole && tokenDoc.role !== requiredRole) {
      throw new ApiError('Insufficient permissions', httpStatus.FORBIDDEN);
    }

    // Fetch the user associated with the token
    const user = await userService.getUserById(tokenDoc.userId);
    if (!user) {
      throw new ApiError('User not found', httpStatus.UNAUTHORIZED);
    }

    return tokenDoc;
  } catch (error) {
    throw new ApiError('Invalid or expired token', httpStatus.UNAUTHORIZED);
  }
};

const generateAuthTokens = async (user: { id: string | number;
  role?: string; }): Promise<AuthTokens> => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const userId = String(user.id);

  const accessToken = generateToken(
    userId,
    accessTokenExpires,
    TokenTypes.ACCESS,
    user.role
  );

  const refreshToken = generateToken(
    userId,
    refreshTokenExpires,
    TokenTypes.REFRESH,
    user.role
  );

  await saveToken(
    refreshToken,
    userId,
    refreshTokenExpires,
    TokenTypes.REFRESH,
    user.role
  );

  return {
    access: {
      token: accessToken,
      expiresAt: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expiresAt: refreshTokenExpires.toDate(),
    },
  };
};

const generateResetPasswordToken = async (email: string): Promise<string> => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError('No user found with this email', httpStatus.NOT_FOUND);
  }
  const role = user.role ?? 'user';
  const expiresAt = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(
    String(user.id),
    expiresAt,
    TokenTypes.PASSWORD_RESET,
    role
  );

  await saveToken(
    resetPasswordToken,
    String(user.id),
    expiresAt,
    TokenTypes.PASSWORD_RESET,
    role
  );

  return resetPasswordToken;
};

const generateVerifyEmailToken = async (user: { id: string,
  role?: string; }): Promise<string> => {
  const expiresAt = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(
    user.id,
    expiresAt,
    TokenTypes.EMAIL_VERIFICATION,
    user.role
  );

  await saveToken(
    verifyEmailToken,
    user.id,
    expiresAt,
    TokenTypes.EMAIL_VERIFICATION
  );

  return verifyEmailToken;
};

const generateJwtToken = (user: any) => {
  const payload = {
    sub: user.id,  // 'sub' is typically used for the user ID
    name: user.name, // Optional: other user information you may want to include in the token
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresAtIn: config.jwt.accessExpirationMinutes * 60, // Expiry time for the access token
  });
};

export const tokenService = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  blacklistToken: TokenModel.blacklistToken,
  generateJwtToken
};
