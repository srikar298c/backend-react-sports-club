import { Request, Response } from "express";
import { SlotData, BlockedSlotData, RecurrenceData } from "../types";
import catchAsync from "../utils/catchAsync";

import httpStatus from "http-status";
import { slotServices } from "../services";
import ApiError from "../utils/ApiError";

/**
 * Add slots to an existing ground.
 */
 const addSlotsToGround = catchAsync(async (req: Request, res: Response) => {
  const { groundId, slots }: { groundId: number; slots: SlotData[] } = req.body;
  const addedSlots = await slotServices.addSlotsToGround(groundId, slots);
  res.status(httpStatus.CREATED).send({ success: true, data: addedSlots });
});

/**
 * Get available slots for a ground on a specific date.
 */
const getAvailableSlots = catchAsync(async (req, res) => {
  const { groundId } = req.params;
  const { date } = req.query;

  if (!groundId || !date) {
    throw new ApiError('Ground ID and date are required', httpStatus.BAD_REQUEST);
  }

  const availableSlots = await slotServices.getAvailableSlots(Number(groundId), new Date(date as string) );
  res.status(httpStatus.OK).send(availableSlots);
});

/**
 * Create a recurring slot.
 */
 const createRecurringSlot = catchAsync(async (req: Request, res: Response) => {
  const { slotData, recurrenceData }: { slotData: SlotData & { groundId: number }; recurrenceData: RecurrenceData } =
    req.body;

  const createdSlot = await slotServices.createRecurringSlot(slotData, recurrenceData);
  res.status(httpStatus.CREATED).send({ success: true, data: createdSlot });
});

/**
 * Block a slot for a ground.
 */
 const blockSlot = catchAsync(async (req: Request, res: Response) => {
  const blockedSlotData: BlockedSlotData = req.body;

  const blockedSlot = await slotServices.blockSlot(blockedSlotData);
  res.status(httpStatus.CREATED).send({ success: true, data: blockedSlot });
});

export const slotControllers = {
    addSlotsToGround,
    getAvailableSlots,
    createRecurringSlot,
    blockSlot
}