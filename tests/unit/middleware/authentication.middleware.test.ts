import { authenticateRequest } from '../../../src/middlewares/authentication.middleware';
import { verifyAccessToken } from '../../../src/services/authentication';
import { User } from '../../../src/models/user';
import { ApiError } from '../../../src/utils/ApiError';

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

    await expect(authenticateRequest(req, res, next)).rejects.toThrow(
      new ApiError(401, 'Invalid Access Token'),
    );
  });
});
