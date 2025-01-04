import { PrismaClient, User as PrismaUser } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { paginate } from '../prismaClient'; // Assuming this is a utility function
import ApiError from '../utils/ApiError'; // Importing ApiError
import { toJSON } from '../models/plugins';

const prisma = new PrismaClient();



// User-specific functions
const isEmailTaken = async (email: string, excludeUserId?: number): Promise<boolean> => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
        NOT: excludeUserId ? { id: excludeUserId } : undefined,
      },
    });
    return !!user;
  } catch (error) {
    throw new ApiError('Error checking email availability', httpStatus.INTERNAL_SERVER_ERROR);
  }
};

const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<PrismaUser> => {
  try {
    if (await isEmailTaken(data.email)) {
      throw new ApiError('Email is already taken', 400, undefined, 'EMAIL_TAKEN');
    }

    const hashedPassword = await bcrypt.hash(data.password, 8);
    const createdUser = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return toJSON(createdUser); 
    
  } catch (error) {
    throw new ApiError('Email already taken', httpStatus.BAD_REQUEST);
  }
};



const getUsersWithPagination = async (
  filter: Record<string, any> = {},
  options: { page?: number; limit?: number; sortBy?: string } = {}
) => {
  try {
    const paginatedUsers = await paginate<PrismaUser>('user', filter, options);
    paginatedUsers.results = paginatedUsers.results.map(toJSON);

    return paginatedUsers;
  } catch (error) {
    throw new ApiError('Error fetching users with pagination', httpStatus.INTERNAL_SERVER_ERROR);
  }
};

const getUserById = async (id: number): Promise<PrismaUser | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ApiError('User not found', httpStatus.NOT_FOUND);
    }

    return toJSON(user);
  } catch (error) {
    throw new ApiError('Error fetching user by ID', httpStatus.INTERNAL_SERVER_ERROR);
  }
};

const updateUser = async (
  id: number,
  updateData: Partial<{
    name: string;
    email: string;
    password: string;
    role: string;
    isEmailVerified: boolean;  // Add this property
  }>
): Promise<PrismaUser | null> => {
  try {
    if (updateData.email && (await isEmailTaken(updateData.email, id))) {
      throw new ApiError('Email is already taken', httpStatus.BAD_REQUEST);
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 8);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return toJSON(updatedUser);
  } catch (error) {
    throw new ApiError('Error updating user', httpStatus.INTERNAL_SERVER_ERROR);
  }
};

const deleteUser = async (id: number): Promise<void> => {
  try {
    await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    throw new ApiError('Error deleting user', httpStatus.INTERNAL_SERVER_ERROR);
  }
};

const getUserByEmail = async (email: string): Promise<PrismaUser | null> => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
console.log(user);

  return user ;
};

export const userService = {
  createUser,
  getUsersWithPagination,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  isEmailTaken,

};
