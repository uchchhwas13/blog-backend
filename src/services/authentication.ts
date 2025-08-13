import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/user';
const secret = 'cefalo@123';

const userTokenPayloadSchema = z.object({
  id: z.string(),
  email: z.string(),
  profileImageUrl: z.string().optional(),
  role: z.string(),
});

export type UserTokenPayload = z.infer<typeof userTokenPayloadSchema>;

export const generateTokenForUser = (user: IUser): string => {
  const payload: UserTokenPayload = {
    id: user._id.toString(),
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
  };
  return jwt.sign(payload, secret);
};

export function verifyToken(token: string): UserTokenPayload | null {
  try {
    const decoded = jwt.verify(token, secret);
    const parsed = userTokenPayloadSchema.safeParse(decoded);
    if (parsed.success) {
      return parsed.data;
    }
    return null;
  } catch {
    return null;
  }
}

// function isUserTokenPayload(obj: any): obj is UserTokenPayload {
//   return (
//     typeof obj === 'object' &&
//     obj !== null &&
//     typeof obj.id === 'string' &&
//     typeof obj.email === 'string' &&
//     typeof obj.role === 'string'
//   );
// }

// export function verifyToken(token: string): UserTokenPayload | null {
//   try {
//     const decoded = jwt.verify(token, secret);
//     if (isUserTokenPayload(decoded)) {
//       return decoded;
//     }
//     return null;
//   } catch {
//     return null;
//   }
//}
