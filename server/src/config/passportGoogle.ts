import { PassportStatic } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
 import { config } from './config';
import { User } from '../models';
const prisma = new PrismaClient();

const googleStrategy = new GoogleStrategy(
  {
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
  callbackURL: 'http://localhost:4000/api/auth/callback/google',

  },
    async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findUserByGoogleId(profile.id); // Use the model function
      if (!user) {

        user = await User.createGoogleUser({
          googleId: profile.id,
          email: profile.emails?.[0].value,
          name: profile.displayName,
        }); // Create user if not found
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);


export const setupGoogleStrategy = (passport: PassportStatic) => {
  passport.use('google', googleStrategy);

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id:number, done) => {
    try {
      const user = await User.findUserById(id); // Use the model function
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};