"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groundServices = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
// Import necessary dependencies
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
/**
 * Create a new ground.
 * @param groundData - Data for the new ground
 * @returns The created ground
 */
async function createGround(groundData) {
    try {
        const ground = await prisma.ground.create({
            data: {
                groundName: groundData.groundName,
                location: groundData.location,
                description: groundData.description,
                type: groundData.type,
                media: groundData.media || [],
                availability: groundData.availability
            },
        });
        return ground;
    }
    catch (error) {
        console.log(error);
        throw new ApiError_1.default('Failed to create ground', httpStatus.NOT_ACCEPTABLE);
    }
}
/**
 * Update ground details.
 * @param groundId - ID of the ground to update
 * @param updates - Partial data to update the ground
 * @returns The updated ground
 */
async function updateGround(groundId, updates) {
    try {
        const updatedGround = await prisma.ground.update({
            where: { id: groundId },
            data: updates,
        });
        return updatedGround;
    }
    catch (error) {
        throw new ApiError_1.default('Failed to update ground details', 400);
    }
}
/**
 * Delete a ground by ID.
 * @param groundId - ID of the ground to delete
 * @returns The deleted ground
 */
async function deleteGround(groundId) {
    try {
        const deletedGround = await prisma.ground.delete({
            where: { id: groundId },
        });
        return deletedGround;
    }
    catch (error) {
        throw new ApiError_1.default('Failed to delete ground', 400);
    }
}
/**
 * Get all grounds with details.
 * @returns List of all grounds with their slots and bookings
 */
async function getAllGrounds() {
    try {
        const grounds = await prisma.ground.findMany({
            include: {
                slots: true,
                bookings: true,
            },
        });
        return grounds;
    }
    catch (error) {
        throw new ApiError_1.default('Failed to fetch all grounds', 404);
    }
}
exports.groundServices = {
    createGround,
    updateGround,
    deleteGround,
    getAllGrounds
};
