"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const http_status_1 = __importDefault(require("http-status"));
const userService = __importStar(require("../services/user.service"));
const register = async (req, res) => {
    const user = await userService.registerUser(req.body);
    res.status(http_status_1.default.CREATED).send(user);
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const isMatch = await userService.verifyPassword(email, password);
    if (!isMatch) {
        return res.status(http_status_1.default.UNAUTHORIZED).send({ message: 'Invalid email or password' });
    }
    res.status(http_status_1.default.OK).send({ message: 'Login successful' });
};
exports.login = login;
