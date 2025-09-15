import { validateBlog } from '../../../src/middlewares/validateBlog.middleware';

jest.mock('../../../src/validations/blogSchema', () => ({
  blogTextSchema: { parse: jest.fn() },
  imageFileSchema: { parse: jest.fn() },
}));

jest.mock('../../../src/utils/formatZodError', () => ({
  formatZodError: jest.fn().mockReturnValue([{ field: 'title', message: 'Required' }]),
}));

describe('validateBlog middleware', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { body: {}, file: {}, user: { id: 'user123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    jest.clearAllMocks();
  });

  it('should return 401 if user is missing', () => {
    req.user = null;

    validateBlog(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });
});
