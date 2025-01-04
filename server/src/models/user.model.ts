import { PrismaClient, User as PrismaUser } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { paginate } from '../prismaClient'; 

const prisma = new PrismaClient();

export const toJSON = <T extends Record<string, any>>(data: T): T => {
  const result = { ...data };

  // Remove private fields, such as password
  const privateFields = ['password']; // Add other private fields here
  privateFields.forEach((field) => delete result[field]);

  // Remove metadata fields if present (e.g., createdAt, updatedAt)
  delete result.createdAt;
  delete result.updatedAt;

  return result;
};

// User-specific functions
const isEmailTaken = async (email: string, excludeUserId?: number): Promise<boolean> => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      NOT: { id: excludeUserId },
    },
  });
  return !!user;
};

const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<PrismaUser> => {
  const hashedPassword = await bcrypt.hash(data.password, 8);
  const createdUser = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });

  return toJSON(createdUser); // Apply toJSON to the created user
};

const isPasswordMatch = async (password: string, userPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, userPassword);
};

// Reuse the pagination function for users
const getUsersWithPagination = async (
  filter: Record<string, any> = {},
  options: { page?: number; limit?: number; sortBy?: string } = {}
) => {
  const paginatedUsers = await paginate<PrismaUser>('user', filter, options);
  // Apply the toJSON transformation to each user in the result
  paginatedUsers.results = paginatedUsers.results.map(toJSON);

  return paginatedUsers;
};

const findUserById = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id }, // id is an integer
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const findUserByGoogleId = async (googleId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { googleId },
    });

    return user;
  } catch (error) {
    console.error('Error in findUserByGoogleId:', error);
    throw error;
  }
};
const createGoogleUser = async (data: {
  email?: string; // Allow undefined
  name?: string;
  googleId?: string;
  role?: string;
}) => {
  try {
    const user = await prisma.user.create({
      data: {
        ...data,
      },
    });

    return user;
  } catch (error) {
    console.error('Error in createGoogleUser:', error);
    throw error;
  }
};


export const User = {
  isEmailTaken,
  createUser,
  isPasswordMatch,
  getUsersWithPagination,
  findUserById,
  findUserByGoogleId,
  createGoogleUser
};
