import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import { groundServices } from '../services/ground.service';

/**
 * Create a ground
 */
const createGround = catchAsync(async (req, res) => {
  const ground = await groundServices.createGround(req.body);
  res.status(httpStatus.CREATED).send({ success: true, data: ground });
});

/**
 * Add slots to a ground
 */
const addSlotsToGround = catchAsync(async (req, res) => {
  const { groundId, slots } = req.body;

  if (!groundId || !slots) {
    throw new ApiError('Ground ID and slots are required', httpStatus.BAD_REQUEST);
  }

  const result = await groundServices.addSlotsToGround(groundId, slots);
  res.status(httpStatus.CREATED).send(result);
});

/**
 * Get available slots for a ground
 */
const getAvailableSlots = catchAsync(async (req, res) => {
  const { groundId } = req.params;
  const { date } = req.query;

  if (!groundId || !date) {
    throw new ApiError('Ground ID and date are required', httpStatus.BAD_REQUEST);
  }

  const availableSlots = await groundServices.getAvailableSlots(Number(groundId), date as string);
  res.status(httpStatus.OK).send(availableSlots);
});

/**
 * Get all grounds
 */
const getAllGrounds = catchAsync(async (req, res) => {
  const grounds = await groundServices.getAllGrounds();
  res.status(httpStatus.OK).send(grounds);
});

/**
 * Update a ground
 */
const updateGround = catchAsync(async (req, res) => {
  const { groundId } = req.params;

  if (!groundId) {
    throw new ApiError('Ground ID is required', httpStatus.BAD_REQUEST);
  }

  const updatedGround = await groundServices.updateGround(Number(groundId), req.body);
  res.status(httpStatus.OK).send(updatedGround);
});

/**
 * Delete a ground
 */
const deleteGround = catchAsync(async (req, res) => {
  const { groundId } = req.params;

  if (!groundId) {
    throw new ApiError('Ground ID is required', httpStatus.BAD_REQUEST);
  }

  await groundServices.deleteGround(Number(groundId));
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Export all controllers individually
 */
export const groundController = {
  createGround,
  addSlotsToGround,
  getAvailableSlots,
  getAllGrounds,
  updateGround,
  deleteGround,
};
