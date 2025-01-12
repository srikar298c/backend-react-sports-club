"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groundController = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const services_1 = require("../services");
/**
 * Create a ground
 */
const createGround = (0, catchAsync_1.default)(async (req, res) => {
    const ground = await services_1.groundServices.createGround(req.body);
    res.status(http_status_1.default.CREATED).send({ success: true, data: ground });
});
/**
 * Add slots to a ground
 */
const addSlotsToGround = (0, catchAsync_1.default)(async (req, res) => {
    const { groundId, slots } = req.body;
    if (!groundId || !slots) {
        throw new ApiError_1.default('Ground ID and slots are required', http_status_1.default.BAD_REQUEST);
    }
    const result = await services_1.slotServices.addSlotsToGround(groundId, slots);
    res.status(http_status_1.default.CREATED).send(result);
});
/**
 * Get available slots for a ground
 */
/**
 * Get all grounds
 */
const getAllGrounds = (0, catchAsync_1.default)(async (req, res) => {
    const grounds = await services_1.groundServices.getAllGrounds();
    res.status(http_status_1.default.OK).send(grounds);
});
/**
 * Update a ground
 */
const updateGround = (0, catchAsync_1.default)(async (req, res) => {
    const { groundId } = req.params;
    if (!groundId) {
        throw new ApiError_1.default('Ground ID is required', http_status_1.default.BAD_REQUEST);
    }
    const updatedGround = await services_1.groundServices.updateGround(Number(groundId), req.body);
    res.status(http_status_1.default.OK).send(updatedGround);
});
/**
 * Delete a ground
 */
const deleteGround = (0, catchAsync_1.default)(async (req, res) => {
    const { groundId } = req.params;
    if (!groundId) {
        throw new ApiError_1.default('Ground ID is required', http_status_1.default.BAD_REQUEST);
    }
    await services_1.groundServices.deleteGround(Number(groundId));
    res.status(http_status_1.default.NO_CONTENT).send();
});
/**
 * Export all controllers individually
 */
exports.groundController = {
    createGround,
    addSlotsToGround,
    getAllGrounds,
    updateGround,
    deleteGround,
};
