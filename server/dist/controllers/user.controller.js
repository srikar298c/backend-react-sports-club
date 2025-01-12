"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../utils/pick"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const services_1 = require("../services");
const prismaClient_1 = require("../prismaClient");
const services_2 = require("../services");
const createUser = (0, catchAsync_1.default)(async (req, res) => {
    // Step 1: Create the user using the provided request body
    const user = await services_1.userService.createUser(req.body);
    // Step 2: Generate the access and refresh tokens for the user
    const tokens = await services_2.tokenService.generateAuthTokens({ id: user.id,
        role: user.role || 'user', });
    // Step 3: Set the tokens as cookies in the response
    res.setHeader('Authorization', `Bearer ${tokens.access.token}`);
    res.cookie('refreshToken', tokens.refresh.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: tokens.refresh.expires, // Expiration for refresh token
    });
    res.status(http_status_1.default.CREATED).send({
        message: 'User created successfully',
        user: {
            email: user.email,
            name: user.name,
            role: user.role,
        },
    });
});
const getUsers = (0, catchAsync_1.default)(async (req, res) => {
    const filter = (0, pick_1.default)(req.query, ['name', 'role']);
    // Convert string query params to appropriate types
    const options = {
        sortBy: (0, pick_1.default)(req.query, ['sortBy'])?.sortBy,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        page: req.query.page ? Number(req.query.page) : undefined,
    };
    const result = await (0, prismaClient_1.paginate)('user', filter, options);
    res.send(result);
});
const getUser = (0, catchAsync_1.default)(async (req, res) => {
    const user = await services_1.userService.getUserById(Number(req.params.userId));
    if (!user) {
        throw new ApiError_1.default('User not found', http_status_1.default.NOT_FOUND);
    }
    res.send(user);
});
const updateUser = (0, catchAsync_1.default)(async (req, res) => {
    const user = await services_1.userService.updateUser(Number(req.params.userId), req.body);
    res.send(user);
});
const deleteUser = (0, catchAsync_1.default)(async (req, res) => {
    await services_1.userService.deleteUser(Number(req.params.userId));
    res.status(http_status_1.default.NO_CONTENT).send();
});
exports.userController = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
};
