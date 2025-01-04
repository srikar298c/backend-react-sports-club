"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const client_1 = require("@prisma/client");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const prisma = new client_1.PrismaClient();
const createUser = async (userBody) => {
    const existingUser = await prisma.user.findUnique({ where: { email: userBody.email } });
    if (existingUser) {
        throw new ApiError_1.default('Email already taken', http_status_1.default.BAD_REQUEST);
    }
    return prisma.user.create({ data: userBody });
};
const queryUsers = async (filter, options) => {
    const { sortBy, limit = 10, page = 1 } = options;
    const sortOptions = sortBy
        ? { [sortBy.split(':')[0]]: sortBy.split(':')[1] === 'desc' ? 'desc' : 'asc' }
        : {};
    const totalResults = await prisma.user.count({ where: filter });
    if (totalResults === 0) {
        throw new ApiError_1.default('No users found', http_status_1.default.NOT_FOUND);
    }
    const totalPages = Math.ceil(totalResults / limit);
    const results = await prisma.user.findMany({
        where: filter,
        orderBy: sortOptions,
        skip: (page - 1) * limit,
        take: limit,
    });
    return { results, page, limit, totalPages, totalResults };
};
const getUserById = async (id) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new ApiError_1.default('User not found', http_status_1.default.NOT_FOUND);
    }
    return user;
};
const getUserByEmail = async (email) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new ApiError_1.default('User not found with this email', http_status_1.default.NOT_FOUND);
    }
    return user;
};
const updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId); // Will throw ApiError if not found
    if (updateBody.email) {
        const existingUser = await prisma.user.findUnique({ where: { email: updateBody.email } });
        if (existingUser && existingUser.id !== userId) {
            throw new ApiError_1.default('Email already taken', http_status_1.default.BAD_REQUEST);
        }
    }
    return prisma.user.update({
        where: { id: userId },
        data: updateBody,
    });
};
const deleteUserById = async (userId) => {
    const user = await getUserById(userId); // Will throw ApiError if not found
    return prisma.user.delete({ where: { id: userId } });
};
exports.default = {
    createUser,
    queryUsers,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById,
};
