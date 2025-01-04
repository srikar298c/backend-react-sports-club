import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { PassportStatic } from 'passport';
import { config } from './config'; // Assuming you have a config for environment variables
import { User } from '../models'; // Replace with your User model

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
  secretOrKey: config.jwt.secret, 
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    // Find the user by ID in the payload
    const user = await User.findUserById(payload.sub); // Assuming `sub` contains the user ID
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

// Function to initialize Passport with the JWT strategy
export const setupJwtStrategy = (passport: PassportStatic) => {
  passport.use('jwt', jwtStrategy);
};
