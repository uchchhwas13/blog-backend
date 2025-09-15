import { authenticateRequest } from '../../../src/middlewares/authentication.middleware';
import { verifyAccessToken } from '../../../src/services/authentication';
import { User } from '../../../src/models/user';
import { ApiError } from '../../../src/utils/ApiError';
import { TokenExpiredError } from 'jsonwebtoken';

jest.mock('../../../src/services/authentication');
jest.mock('../../../src/models/user');

describe('authenticateRequest middleware', () => {
  const next = jest.fn();
  const res: any = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next if no token is provided', async () => {
    const req: any = { headers: {} };
    expect(next).toHaveBeenCalledTimes(0);
    await authenticateRequest(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toBeUndefined();
  });

  it('should attach user payload and call next for valid token', async () => {
    const token = 'validAccessToken';
    const userId = 'user123';
    const req: any = { headers: { authorization: `Bearer ${token}` } };
    const payload = { id: userId };

    (verifyAccessToken as jest.Mock).mockReturnValue(payload);
    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: userId,
        name: 'John',
      }),
    });

    await authenticateRequest(req, res, next);

    expect(verifyAccessToken).toHaveBeenCalledWith(token);
    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should throw ApiError(401) if user not found', async () => {
    const req: any = { headers: { authorization: 'Bearer token' } };

    (verifyAccessToken as jest.Mock).mockReturnValue({ id: 'user123' });
    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    expect.assertions(3); // ensures catch runs

    try {
      await authenticateRequest(req, res, next);
    } catch (err: any) {
      expect(err).toBeInstanceOf(ApiError);
      expect(err.statusCode).toBe(401);
      expect(err.message).toBe('Invalid Access Token');
    }
  });

  it('should throw ApiError(401) if token is expired', async () => {
    const req: any = { headers: { authorization: 'Bearer token' } };

    (verifyAccessToken as jest.Mock).mockImplementation(() => {
      throw new TokenExpiredError('expired', new Date());
    });

    expect.assertions(3); // ensures catch runs

    try {
      await authenticateRequest(req, res, next);
    } catch (err: any) {
      expect(err).toBeInstanceOf(ApiError);
      expect(err.statusCode).toBe(401);
      expect(err.message).toBe('Access Token Expired');
    }
  });
});
