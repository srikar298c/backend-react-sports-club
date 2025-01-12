"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupJwtStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("./config"); // Assuming you have a config for environment variables
const models_1 = require("../models"); // Replace with your User model
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config_1.config.jwt.secret,
};
const jwtStrategy = new passport_jwt_1.Strategy(jwtOptions, async (payload, done) => {
    try {
        // Find the user by ID in the payload
        const user = await models_1.User.findUserById(payload.sub); // Assuming `sub` contains the user ID
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error, false);
    }
});
// Function to initialize Passport with the JWT strategy
const setupJwtStrategy = (passport) => {
    passport.use('jwt', jwtStrategy);
};
exports.setupJwtStrategy = setupJwtStrategy;
