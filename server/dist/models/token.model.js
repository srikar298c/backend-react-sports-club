"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenModel = exports.toJSON = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const toJSON = (data) => {
    const result = { ...data };
    const privateFields = ['password'];
    privateFields.forEach((field) => delete result[field]);
    delete result.__v;
    delete result.createdAt;
    delete result.updatedAt;
    return result;
};
exports.toJSON = toJSON;
const createToken = async ({ userId, token, type, expires, blacklisted = false, role }) => {
    try {
        const createdToken = await prisma.token.create({
            data: {
                userId,
                token,
                type,
                expires,
                blacklisted,
                role
            },
        });
        return (0, exports.toJSON)(createdToken);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error creating token: ${error.message}`);
        }
        throw new Error("Unknown error occurred while creating token.");
    }
};
const getTokenByUserAndType = async (userId, type, requiredRole) => {
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
        return token ? (0, exports.toJSON)(token) : null;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error fetching token: ${error.message}`);
        }
        throw new Error("Unknown error occurred while fetching token.");
    }
};
const getTokensByUser = async (userId) => {
    try {
        const tokens = await prisma.token.findMany({
            where: {
                userId,
                blacklisted: false,
            },
        });
        return tokens.map(exports.toJSON);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error fetching tokens for user: ${error.message}`);
        }
        throw new Error("Unknown error occurred while fetching tokens for user.");
    }
};
const blacklistToken = async (tokenId) => {
    try {
        const blacklistedToken = await prisma.token.update({
            where: { id: tokenId },
            data: { blacklisted: true },
        });
        return (0, exports.toJSON)(blacklistedToken);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error blacklisting token: ${error.message}`);
        }
        throw new Error("Unknown error occurred while blacklisting token.");
    }
};
const deleteToken = async (tokenId) => {
    try {
        const deletedToken = await prisma.token.delete({
            where: { id: tokenId },
        });
        return (0, exports.toJSON)(deletedToken);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error deleting token: ${error.message}`);
        }
        throw new Error("Unknown error occurred while deleting token.");
    }
};
const getTokenById = async (tokenId) => {
    try {
        const token = await prisma.token.findUnique({
            where: { id: tokenId },
        });
        return token ? (0, exports.toJSON)(token) : null;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error fetching token by ID: ${error.message}`);
        }
        throw new Error("Unknown error occurred while fetching token by ID.");
    }
};
const updateToken = async (tokenId, updateData) => {
    try {
        const updatedToken = await prisma.token.update({
            where: { id: tokenId },
            data: updateData,
        });
        return (0, exports.toJSON)(updatedToken);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error updating token: ${error.message}`);
        }
        throw new Error("Unknown error occurred while updating token.");
    }
};
exports.TokenModel = {
    createToken,
    getTokenByUserAndType,
    getTokensByUser,
    getTokenById,
    updateToken,
    blacklistToken,
    deleteToken,
};
