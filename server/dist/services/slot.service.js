"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotServices = void 0;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ApiError = require('../utils/ApiError');
/**
 * Add slots to an existing ground.
 * @param groundId - ID of the ground
 * @param slots - Array of slot data to add
 * @returns The result of the slot creation
 */
async function addSlotsToGround(groundId, slots) {
    try {
        const addedSlots = await prisma.slot.createMany({
            data: slots.map(({ startHour, endHour, price, duration, recurring }) => ({
                groundId,
                startHour,
                endHour,
                price,
                duration,
                recurring: recurring || false,
            })),
        });
        return addedSlots;
    }
    catch (error) {
        throw new ApiError('Failed to add slots to ground', 400);
    }
}
/**
 * Get available slots for a ground on a specific date.
 * @param groundId - ID of the ground
 * @param date - Date to check availability
 * @returns Array of available slots
 */
async function getAvailableSlots(groundId, date) {
    try {
        const blockedSlots = await prisma.blockedSlot.findMany({
            where: {
                groundId,
                date,
            },
        });
        const allSlots = await prisma.slot.findMany({
            where: { groundId },
        });
        const availableSlots = allSlots.filter((slot) => {
            return !blockedSlots.some((blocked) => blocked.startHour === slot.startHour &&
                blocked.endHour === slot.endHour);
        });
        return availableSlots;
    }
    catch (error) {
        throw new ApiError('Failed to fetch available slots', 404);
    }
}
/**
 * Create a recurring slot.
 * @param slotData - Data for the slot
 * @param recurrenceData - Recurrence details
 * @returns The created slot with recurrence
 */
async function createRecurringSlot(slotData, recurrenceData) {
    try {
        const { startHour, endHour, price, duration, recurring, groundId } = slotData;
        const slot = await prisma.slot.create({
            data: {
                startHour,
                endHour,
                price,
                duration,
                recurring: recurring || false,
                groundId,
                recurrence: {
                    create: recurrenceData,
                },
            },
            include: { recurrence: true },
        });
        return slot;
    }
    catch (error) {
        throw new ApiError('Failed to create recurring slot', 400);
    }
}
/**
 * Block a slot for a ground.
 * @param blockedSlotData - Data for the blocked slot
 * @returns The created blocked slot
 */
async function blockSlot(blockedSlotData) {
    try {
        const blockedSlot = await prisma.blockedSlot.create({
            data: {
                groundId: blockedSlotData.groundId,
                date: blockedSlotData.date,
                startHour: blockedSlotData.startHour,
                endHour: blockedSlotData.endHour,
                reason: blockedSlotData.reason,
            },
        });
        return blockedSlot;
    }
    catch (error) {
        throw new ApiError('Failed to block slot', 400);
    }
}
exports.slotServices = {
    addSlotsToGround,
    getAvailableSlots,
    blockSlot,
    createRecurringSlot
};
