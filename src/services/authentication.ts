import { z } from 'zod';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';

const userTokenPayloadSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

const refreshTokenPayloadSchema = z.object({
  id: z.string(),
});

export type UserTokenPayload = z.infer<typeof userTokenPayloadSchema>;
export type RefreshTokenPayload = z.infer<typeof refreshTokenPayloadSchema>;

export function verifyAccessToken(token: string): UserTokenPayload {
  const secret = process.env.ACCESS_TOKEN_SECRET!;

  const decoded = jwt.verify(token, secret);

  const parsed = userTokenPayloadSchema.safeParse(decoded);
  if (!parsed.success) {
    throw new JsonWebTokenError('Invalid payload');
  }

  return parsed.data;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  const secret = process.env.REFRESH_TOKEN_SECRET;

  if (!secret) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined');
  }

  try {
    const decoded = jwt.verify(token, secret);
    const parsed = refreshTokenPayloadSchema.safeParse(decoded);

    if (parsed.success) {
      return parsed.data;
    }
    return null;
  } catch {
    return null;
  }
}
