"use strict";
// user.ts (or models/user.ts)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.toJSON = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prismaClient_1 = require("../prismaClient"); // Import the pagination function
const prisma = new client_1.PrismaClient();
// Define the toJSON function to sanitize and format the user data
const toJSON = (data) => {
    const result = { ...data };
    // Remove private fields, such as password
    const privateFields = ['password']; // Add other private fields here
    privateFields.forEach((field) => delete result[field]);
    // Remove metadata fields if present (e.g., createdAt, updatedAt)
    delete result.createdAt;
    delete result.updatedAt;
    return result;
};
exports.toJSON = toJSON;
// User-specific functions
const isEmailTaken = async (email, excludeUserId) => {
    const user = await prisma.user.findFirst({
        where: {
            email,
            NOT: { id: excludeUserId },
        },
    });
    return !!user;
};
const createUser = async (data) => {
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 8);
    const createdUser = await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
        },
    });
    return (0, exports.toJSON)(createdUser); // Apply toJSON to the created user
};
const isPasswordMatch = async (password, userPassword) => {
    return bcryptjs_1.default.compare(password, userPassword);
};
// Reuse the pagination function for users
const getUsersWithPagination = async (filter = {}, options = {}) => {
    const paginatedUsers = await (0, prismaClient_1.paginate)('user', filter, options);
    // Apply the toJSON transformation to each user in the result
    paginatedUsers.results = paginatedUsers.results.map(exports.toJSON);
    return paginatedUsers;
};
exports.User = {
    isEmailTaken,
    createUser,
    isPasswordMatch,
    getUsersWithPagination,
};
