import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../models/user';
const secret = 'cefalo@123';

export const generateTokenForUser = (user: IUser): string => {
  const payload = {
    id: user._id,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
  };
  return jwt.sign(payload, secret);
};

export function verifyToken(token: string): string | JwtPayload {
  const payload = jwt.verify(token, secret);
  return payload;
  // TODO: Need to handle errors properly
  //   try {
  //     return JWT.verify(token, secret);
  //   } catch (error) {
  //     return null;
  //   }
}
