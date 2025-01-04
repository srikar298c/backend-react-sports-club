import { PrismaClient, Token } from '@prisma/client';
import { TokenTypes } from '../config/token';

const prisma = new PrismaClient();

export const toJSON = <T extends Record<string, any>>(data: T): T => {
  const result = { ...data };
  const privateFields = ['password'];
  privateFields.forEach((field) => delete result[field]);
  
  delete result.__v;
  delete result.createdAt;
  delete result.updatedAt;

  return result;
};

interface TokenCreateInput {
  userId: number;
  token: string;
  type: TokenTypes;
  expires: Date;
  blacklisted?: boolean;
  role?: string;
}

const createToken = async ({
  userId,
  token,
  type,
  expires,
  blacklisted = false,
  role
}: TokenCreateInput): Promise<Token> => {
  try {
    const createdToken = await prisma.token.create({
      data: {
        userId,
        token,
        type,
        expires,
        blacklisted,
        role,
      },
    });

    return toJSON(createdToken);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error creating token: ${error.message}`);
    }
    throw new Error("Unknown error occurred while creating token.");
  }
};

const getTokenByUserAndType = async (
  userId: number, 
  type: TokenTypes,
  requiredRole?: string
): Promise<Token | null> => {
  try {
    const token = await prisma.token.findFirst({
      where: {
        userId,
        type,
        blacklisted: false,
        ...(requiredRole && {
          role: requiredRole
        })
      },
    });

    return token ? toJSON(token) : null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error fetching token: ${error.message}`);
    }
    throw new Error("Unknown error occurred while fetching token.");
  }
};

const getTokensByUser = async (userId: number): Promise<Token[]> => {
  try {
    const tokens = await prisma.token.findMany({
      where: {
        userId,
        blacklisted: false,
      },
    });

    return tokens.map(toJSON);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error fetching tokens for user: ${error.message}`);
    }
    throw new Error("Unknown error occurred while fetching tokens for user.");
  }
};

const blacklistToken = async (tokenId: number): Promise<Token> => {
  try {
    const blacklistedToken = await prisma.token.update({
      where: { id: tokenId },
      data: { blacklisted: true },
    });

    return toJSON(blacklistedToken);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error blacklisting token: ${error.message}`);
    }
    throw new Error("Unknown error occurred while blacklisting token.");
  }
};

const deleteToken = async (tokenId: number): Promise<Token> => {
  try {
    const deletedToken = await prisma.token.delete({
      where: { id: tokenId },
    });

    return toJSON(deletedToken);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error deleting token: ${error.message}`);
    }
    throw new Error("Unknown error occurred while deleting token.");
  }
};

const getTokenById = async (tokenId: number): Promise<Token | null> => {
  try {
    const token = await prisma.token.findUnique({
      where: { id: tokenId },
    });

    return token ? toJSON(token) : null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error fetching token by ID: ${error.message}`);
    }
    throw new Error("Unknown error occurred while fetching token by ID.");
  }
};

interface TokenUpdateInput {
  role?: string;
  blacklisted?: boolean;
  expires?: Date;
}

const updateToken = async (tokenId: number, updateData: TokenUpdateInput): Promise<Token> => {
  try {
    const updatedToken = await prisma.token.update({
      where: { id: tokenId },
      data: updateData,
    });

    return toJSON(updatedToken);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error updating token: ${error.message}`);
    }
    throw new Error("Unknown error occurred while updating token.");
  }
};

export const TokenModel = {
  createToken,
  getTokenByUserAndType,
  getTokensByUser,
  getTokenById,
  updateToken,
  blacklistToken,
  deleteToken,
};