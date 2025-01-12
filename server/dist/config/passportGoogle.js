"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupGoogleStrategy = void 0;
const passport_google_oauth20_1 = require("passport-google-oauth20");
const client_1 = require("@prisma/client");
const config_1 = require("./config");
const models_1 = require("../models");
const prisma = new client_1.PrismaClient();
const googleStrategy = new passport_google_oauth20_1.Strategy({
    clientID: config_1.config.google.clientId,
    clientSecret: config_1.config.google.clientSecret,
    callbackURL: 'http://localhost:4000/api/auth/callback/google',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await models_1.User.findUserByGoogleId(profile.id); // Use the model function
        if (!user) {
            user = await models_1.User.createGoogleUser({
                googleId: profile.id,
                email: profile.emails?.[0].value,
                name: profile.displayName,
            }); // Create user if not found
        }
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});
const setupGoogleStrategy = (passport) => {
    passport.use('google', googleStrategy);
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await models_1.User.findUserById(id); // Use the model function
            done(null, user);
        }
        catch (error) {
            done(error, null);
        }
    });
};
exports.setupGoogleStrategy = setupGoogleStrategy;
