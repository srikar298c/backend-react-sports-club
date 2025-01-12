const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ApiError = require('../utils/ApiError');

/**
 * Get total number of grounds owned by a specific user.
 * @param userId - ID of the user
 * @returns Total grounds count
 */
 async function getTotalGroundsByUser(userId: number): Promise<number> {
  try {
    const totalGrounds = await prisma.ground.count({
      where: { userId },
    });
    return totalGrounds;
  } catch (error) {
    throw new ApiError('Failed to fetch total grounds by user', 400);
  }
}

/**
 * Get statistics of available and non-available grounds.
 * @returns Object containing counts of available and non-available grounds
 */
 async function getGroundAvailabilityStats(): Promise<{
  availableGrounds: number;
  nonAvailableGrounds: number;
}> {
  try {
    const [availableGrounds, nonAvailableGrounds] = await Promise.all([
      prisma.ground.count({ where: { availability: true } }),
      prisma.ground.count({ where: { availability: false } }),
    ]);

    return { availableGrounds, nonAvailableGrounds };
  } catch (error) {
    throw new ApiError('Failed to fetch ground availability stats', 400);
  }
}

/**
 * Get utilization report for a specific ground.
 * @param groundId - ID of the ground
 * @returns Utilization report with total slots, booked slots, and utilization percentage
 */
 async function getGroundUtilizationReport(
  groundId: number
): Promise<{
  groundId: number;
  totalSlots: number;
  bookedSlots: number;
  utilizationPercentage: string;
}> {
  try {
    const [totalSlots, bookedSlots] = await Promise.all([
      prisma.slot.count({ where: { groundId } }),
      prisma.slot.count({ where: { groundId, isBooked: true } }),
    ]);

    const utilizationPercentage =
      totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0;

    return {
      groundId,
      totalSlots,
      bookedSlots,
      utilizationPercentage: `${utilizationPercentage.toFixed(2)}%`,
    };
  } catch (error) {
    throw new ApiError('Failed to fetch ground utilization report', 400);
  }
}

/**
 * Get all available grounds with blocked slots.
 * @returns List of grounds with blocked slots
 */
 async function getAvailableGroundsWithBlockedSlots(): Promise<
  Array<{
    id: number;
    name: string;
    blockedSlots: Array<{
      id: number;
      startTime: Date;
      endTime: Date;
    }>;
  }>
> {
  try {
    const grounds = await prisma.ground.findMany({
      where: {
        availability: true,
        blockedSlots: {
          some: {}, // Ensure there are blocked slots
        },
      },
      include: {
        blockedSlots: true,
      },
    });

    return grounds;
  } catch (error) {
    throw new ApiError('Failed to fetch available grounds with blocked slots', 400);
  }
}

export const reportServices={
    getTotalGroundsByUser,
    getAvailableGroundsWithBlockedSlots,
    getGroundAvailabilityStats,
    getGroundUtilizationReport,
    
}