
import { GroundData, UpdateGroundData } from "../types";
import ApiError from "../utils/ApiError";

// Import necessary dependencies
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


/**
 * Create a new ground.
 * @param groundData - Data for the new ground
 * @returns The created ground
 */
 async function createGround(groundData: GroundData) {
  try {
    const ground = await prisma.ground.create({
      data: {
        groundName: groundData.groundName,
        location: groundData.location,
        description: groundData.description,
        type: groundData.type,
        media: groundData.media || [],
        availability:groundData.availability
      },
    });
    return ground;
  } catch (error) {
    console.log(error)
    throw new ApiError('Failed to create ground', httpStatus.NOT_ACCEPTABLE);
  }
}

/**
 * Update ground details.
 * @param groundId - ID of the ground to update
 * @param updates - Partial data to update the ground
 * @returns The updated ground
 */
 async function updateGround(groundId: number, updates: UpdateGroundData) {
  try {
    const updatedGround = await prisma.ground.update({
      where: { id: groundId },
      data: updates,
    });
    return updatedGround;
  } catch (error) {
    throw new ApiError('Failed to update ground details', 400);
  }
}

/**
 * Delete a ground by ID.
 * @param groundId - ID of the ground to delete
 * @returns The deleted ground
 */
 async function deleteGround(groundId: number) {
  try {
    const deletedGround = await prisma.ground.delete({
      where: { id: groundId },
    });
    return deletedGround;
  } catch (error) {
    throw new ApiError('Failed to delete ground', 400);
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
  } catch (error) {
    throw new ApiError('Failed to fetch all grounds', 404);
  }
}

export const groundServices = {
  createGround,
  updateGround,
  deleteGround,
  getAllGrounds
}