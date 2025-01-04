import { User } from '../models'; // Adjust based on your User model



export const findOrCreateUser = async (profile: {
  googleId: string;
  email: string;
  name?: string;
}) => {
  let user = await User.findUserByGoogleId(profile.googleId);

  if (!user) {
    user = await User.createGoogleUser({});
  }

  return user;
};
