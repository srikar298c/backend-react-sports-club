"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../middlewares/validate");
const user_controller_1 = require("../controllers/user.controller");
const user_validation_1 = require("../validations/user.validation");
const router = express_1.default.Router();
router
    .route('/')
    .post(
// auth('manageUsers'),
(0, validate_1.validateRequest)(user_validation_1.userValidation.createUser), user_controller_1.userController.createUser)
    .get(
// auth('getUsers'), 
(0, validate_1.validateRequest)(user_validation_1.userValidation.getUsers), user_controller_1.userController.getUsers);
router
    .route('/:userId')
    .get(
// auth('getUsers'),
(0, validate_1.validateRequest)(user_validation_1.userValidation.getUser), user_controller_1.userController.getUser)
    .patch(
// auth('manageUsers'),
(0, validate_1.validateRequest)(user_validation_1.userValidation.updateUser), user_controller_1.userController.updateUser)
    .delete(
// auth('manageUsers'),
(0, validate_1.validateRequest)(user_validation_1.userValidation.deleteUser), user_controller_1.userController.deleteUser);
exports.default = router;
