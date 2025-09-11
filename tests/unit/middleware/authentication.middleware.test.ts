import { authenticateRequest } from '../../../src/middlewares/authentication.middleware';
import { verifyAccessToken } from '../../../src/services/authentication';
import { User } from '../../../src/models/user';

jest.mock('../../../src/services/authentication');
jest.mock('../../../src/models/user');

describe('authenticateRequest middleware', () => {
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next if no token is provided', async () => {
    const req: any = { headers: {} };
    const res: any = {};
    expect(next).toHaveBeenCalledTimes(0);

    await authenticateRequest(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toBeUndefined();
  });

  it('should attach user payload and call next for valid token', async () => {
    const token = 'validAccessToken';
    const userId = 'user123';
    const req: any = { headers: { authorization: `Bearer ${token}` } };
    const res: any = {};
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
});
