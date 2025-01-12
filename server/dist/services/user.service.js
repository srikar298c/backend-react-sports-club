"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prismaClient_1 = require("../prismaClient"); // Assuming this is a utility function
const ApiError_1 = __importDefault(require("../utils/ApiError")); // Importing ApiError
const plugins_1 = require("../models/plugins");
const prisma = new client_1.PrismaClient();
// User-specific functions
const isEmailTaken = async (email, excludeUserId) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email,
                NOT: excludeUserId ? { id: excludeUserId } : undefined,
            },
        });
        return !!user;
    }
    catch (error) {
        throw new ApiError_1.default('Error checking email availability', httpStatus.INTERNAL_SERVER_ERROR);
    }
};
const createUser = async (data) => {
    try {
        if (await isEmailTaken(data.email)) {
            throw new ApiError_1.default('Email is already taken', 400, undefined, 'EMAIL_TAKEN');
        }
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 8);
        const createdUser = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
        return (0, plugins_1.toJSON)(createdUser);
    }
    catch (error) {
        throw new ApiError_1.default('Email already taken', httpStatus.BAD_REQUEST);
    }
};
const getUsersWithPagination = async (filter = {}, options = {}) => {
    try {
        const paginatedUsers = await (0, prismaClient_1.paginate)('user', filter, options);
        paginatedUsers.results = paginatedUsers.results.map(plugins_1.toJSON);
        return paginatedUsers;
    }
    catch (error) {
        throw new ApiError_1.default('Error fetching users with pagination', httpStatus.INTERNAL_SERVER_ERROR);
    }
};
const getUserById = async (id) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new ApiError_1.default('User not found', httpStatus.NOT_FOUND);
        }
        return (0, plugins_1.toJSON)(user);
    }
    catch (error) {
        throw new ApiError_1.default('Error fetching user by ID', httpStatus.INTERNAL_SERVER_ERROR);
    }
};
const updateUser = async (id, updateData) => {
    try {
        if (updateData.email && (await isEmailTaken(updateData.email, id))) {
            throw new ApiError_1.default('Email is already taken', httpStatus.BAD_REQUEST);
        }
        if (updateData.password) {
            updateData.password = await bcryptjs_1.default.hash(updateData.password, 8);
        }
        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
        });
        return (0, plugins_1.toJSON)(updatedUser);
    }
    catch (error) {
        throw new ApiError_1.default('Error updating user', httpStatus.INTERNAL_SERVER_ERROR);
    }
};
const deleteUser = async (id) => {
    try {
        await prisma.user.delete({
            where: { id },
        });
    }
    catch (error) {
        throw new ApiError_1.default('Error deleting user', httpStatus.INTERNAL_SERVER_ERROR);
    }
};
const getUserByEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    console.log(user);
    return user;
};
exports.userService = {
    createUser,
    getUsersWithPagination,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    isEmailTaken,
};
