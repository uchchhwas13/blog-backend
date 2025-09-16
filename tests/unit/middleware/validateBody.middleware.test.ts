import { validateBody } from '../../../src/middlewares/validateBlog.middleware';
import { z } from 'zod';

jest.mock('../../../src/utils/formatZodError', () => ({
  formatZodError: jest.fn().mockReturnValue([{ field: 'name', message: 'Required' }]),
}));

describe('validateBody middleware', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  const schema = z.object({
    name: z.string(),
  });

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next if validation passes', () => {
    req.body = { name: 'John Doe' };

    const middleware = validateBody(schema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 400 with formatted errors if validation fails', () => {
    req.body = {};
    const middleware = validateBody(schema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: [{ field: 'name', message: 'Required' }],
    });
    expect(next).not.toHaveBeenCalled();
  });
});
