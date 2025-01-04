import httpStatus from 'http-status';
import { Request, Response } from 'express';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { userService } from '../services';
import { User as PrismaUser } from '@prisma/client';
import { paginate } from '../prismaClient'; 
import {tokenService} from '../services';
type UserFilter = {
  name?: string;
  role?: string;
};

type UserQueryOptions = {
  sortBy?: string;
  limit?: number;
  page?: number;
};
const createUser = catchAsync(async (req: Request, res: Response) => {
  // Step 1: Create the user using the provided request body
  const user = await userService.createUser(req.body);
  
  // Step 2: Generate the access and refresh tokens for the user
 const tokens = await tokenService.generateAuthTokens({ id: user.id,
  role: user.role || 'user',}); 
  
  // Step 3: Set the tokens as cookies in the response
    res.setHeader('Authorization', `Bearer ${tokens.access.token}`);

  res.cookie('refreshToken', tokens.refresh.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: tokens.refresh.expires, // Expiration for refresh token
  });



  res.status(httpStatus.CREATED).send({
    message: 'User created successfully',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role:user.role,// Include any other non-sensitive user data
    },
  });
});


const getUsers = catchAsync(async (req: Request, res: Response) => {
  const filter: UserFilter = pick(req.query, ['name', 'role']);
  
  // Convert string query params to appropriate types
  const options: UserQueryOptions = {
    sortBy: pick(req.query, ['sortBy'])?.sortBy as string,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    page: req.query.page ? Number(req.query.page) : undefined,
  };
  
  
  const result = await paginate<PrismaUser>('user', filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(Number(req.params.userId));
  if (!user) {
    throw new ApiError('User not found',httpStatus.NOT_FOUND, );
  }
  res.send(user);
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateUser(Number(req.params.userId), req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await userService.deleteUser(Number(req.params.userId));
  res.status(httpStatus.NO_CONTENT).send();
});

export const userController = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};