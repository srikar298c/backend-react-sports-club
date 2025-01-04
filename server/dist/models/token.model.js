"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenModel = exports.toJSON = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Define a toJSON function to sanitize the token data
const toJSON = (data) => {
    const result = { ...data };
    // Remove private fields, if marked (e.g., define a private fields array)
    const privateFields = ['password']; // Add other private fields here
    privateFields.forEach((field) => delete result[field]);
    // Remove metadata fields if present
    delete result.__v;
    delete result.createdAt;
    delete result.updatedAt;
    return result;
};
exports.toJSON = toJSON;
// Create a new token in the database
const createToken = async (userId, token, type, expires) => {
    try {
        const createdToken = await prisma.token.create({
            data: {
                userId,
                token,
                type,
                expires,
                blacklisted: false, // Default value
            },
        });
        return (0, exports.toJSON)(createdToken); // Apply toJSON to the created token
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error creating token: ${error.message}`);
        }
        throw new Error("Unknown error occurred while creating token.");
    }
};
// Get token by userId and type
const getTokenByUserAndType = async (userId, type) => {
    try {
        const token = await prisma.token.findFirst({
            where: {
                userId,
                type,
                blacklisted: false,
            },
        });
        return token ? (0, exports.toJSON)(token) : null; // Apply toJSON to the token if found
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error fetching token: ${error.message}`);
        }
        throw new Error("Unknown error occurred while fetching token.");
    }
};
// Get all tokens for a user
const getTokensByUser = async (userId) => {
    try {
        const tokens = await prisma.token.findMany({
            where: {
                userId,
                blacklisted: false,
            },
        });
        return tokens.map(exports.toJSON); // Apply toJSON to each token
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error fetching tokens for user: ${error.message}`);
        }
        throw new Error("Unknown error occurred while fetching tokens for user.");
    }
};
// Blacklist a token
const blacklistToken = async (tokenId) => {
    try {
        const blacklistedToken = await prisma.token.update({
            where: { id: tokenId },
            data: { blacklisted: true },
        });
        return (0, exports.toJSON)(blacklistedToken); // Apply toJSON to the blacklisted token
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error blacklisting token: ${error.message}`);
        }
        throw new Error("Unknown error occurred while blacklisting token.");
    }
};
// Delete a token by its ID
const deleteToken = async (tokenId) => {
    try {
        const deletedToken = await prisma.token.delete({
            where: { id: tokenId },
        });
        return (0, exports.toJSON)(deletedToken); // Apply toJSON to the deleted token
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error deleting token: ${error.message}`);
        }
        throw new Error("Unknown error occurred while deleting token.");
    }
};
exports.TokenModel = {
    createToken,
    getTokenByUserAndType,
    getTokensByUser,
    blacklistToken,
    deleteToken,
};
