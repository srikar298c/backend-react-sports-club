"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrCreateUser = void 0;
const models_1 = require("../models"); // Adjust based on your User model
const findOrCreateUser = async (profile) => {
    let user = await models_1.User.findUserByGoogleId(profile.googleId);
    if (!user) {
        user = await models_1.User.createGoogleUser({});
    }
    return user;
};
exports.findOrCreateUser = findOrCreateUser;
