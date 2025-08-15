import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/user';

const userTokenPayloadSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
});

export type UserTokenPayload = z.infer<typeof userTokenPayloadSchema>;

// export const generateTokenForUser = (user: IUser): string => {
//   const payload: UserTokenPayload = {
//     id: user._id.toString(),
//     name: user.name,
//     email: user.email,
//     role: user.role,
//   };
//   return jwt.sign(payload, secret);
// };

export function verifyAccessToken(token: string): UserTokenPayload | null {
  const secret = process.env.ACCESS_TOKEN_SECRET!;
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
