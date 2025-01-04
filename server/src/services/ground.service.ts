import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// type CreateGroundInput = {
//   groundName: string;
//   location: string;
//   description?: string;
//   type: string;
//   media?: string;
//   availability?: boolean;
//   rating?: number;
//   totalPeopleRated?: number;
// };
/**
 * Create a ground
 */
const createGround = async (data: {
  groundName: string;
  location: string;
  description?: string;
  type: string;
  media?: string;
}) => {
  return await prisma.ground.create({
    data,
  });
};
/**
 * Add slots to a ground
 */
const addSlotsToGround = async (groundId: number, slots: { timeRange: string; price: number }[]) => {
  const slotData = slots.map(slot => ({ ...slot, groundId }));
  return await prisma.slot.createMany({
    data: slotData,
  });
};

/**
 * Get available slots for a ground on a specific date
 */
const getAvailableSlots = async (groundId: number, date: string) => {
  const bookings = await prisma.booking.findMany({
    where: { groundId, date: new Date(date) },
    select: { slotId: true },
  });

  const bookedSlotIds = bookings.map(booking => booking.slotId);

  return await prisma.slot.findMany({
    where: {
      groundId,
      id: { notIn: bookedSlotIds },
    },
  });
};

/**
 * Book a slot
 */

/**
 * Get all grounds
 */
const getAllGrounds = async () => {
  return await prisma.ground.findMany({
    include: {
      slots: true,
      bookings: true,
    },
  });
};

/**
 * Update a ground
 */
const updateGround = async (groundId: number, data: Partial<{
  groundName: string;
  location: string;
  description: string;
  type: string;
  media: string;
}>) => {
  return await prisma.ground.update({
    where: { id: groundId },
    data,
  });
};


const deleteGround = async (groundId: number) => {
  return await prisma.ground.delete({
    where: { id: groundId },
  });
};

export const groundServices = {
  createGround,
  addSlotsToGround,
  getAvailableSlots,
    deleteGround,
    getAllGrounds,
  updateGround

};
