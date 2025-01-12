"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotControllers = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const services_1 = require("../services");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Add slots to an existing ground.
 */
const addSlotsToGround = (0, catchAsync_1.default)(async (req, res) => {
    const { groundId, slots } = req.body;
    const addedSlots = await services_1.slotServices.addSlotsToGround(groundId, slots);
    res.status(http_status_1.default.CREATED).send({ success: true, data: addedSlots });
});
/**
 * Get available slots for a ground on a specific date.
 */
const getAvailableSlots = (0, catchAsync_1.default)(async (req, res) => {
    const { groundId } = req.params;
    const { date } = req.query;
    if (!groundId || !date) {
        throw new ApiError_1.default('Ground ID and date are required', http_status_1.default.BAD_REQUEST);
    }
    const availableSlots = await services_1.slotServices.getAvailableSlots(Number(groundId), new Date(date));
    res.status(http_status_1.default.OK).send(availableSlots);
});
/**
 * Create a recurring slot.
 */
const createRecurringSlot = (0, catchAsync_1.default)(async (req, res) => {
    const { slotData, recurrenceData } = req.body;
    const createdSlot = await services_1.slotServices.createRecurringSlot(slotData, recurrenceData);
    res.status(http_status_1.default.CREATED).send({ success: true, data: createdSlot });
});
/**
 * Block a slot for a ground.
 */
const blockSlot = (0, catchAsync_1.default)(async (req, res) => {
    const blockedSlotData = req.body;
    const blockedSlot = await services_1.slotServices.blockSlot(blockedSlotData);
    res.status(http_status_1.default.CREATED).send({ success: true, data: blockedSlot });
});
exports.slotControllers = {
    addSlotsToGround,
    getAvailableSlots,
    createRecurringSlot,
    blockSlot
};
