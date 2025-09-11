import { authenticateRequest } from '../../../src/middlewares/authentication.middleware';

describe('authenticateRequest middleware', () => {
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next if no token is provided', async () => {
    const req: any = { headers: {} };
    const res: any = {};

    const middleware = authenticateRequest('accessToken');
    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toBeUndefined();
  });
});
