import { validateBlog } from '../../../src/middlewares/validateBlog.middleware';
import { blogTextSchema, imageFileSchema } from '../../../src/validations/blogSchema';

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

  it('should return 400 if no file is provided', () => {
    (blogTextSchema.parse as jest.Mock).mockReturnValue(true);
    req.file = null;

    validateBlog(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Cover image is required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if validation passes', () => {
    (blogTextSchema.parse as jest.Mock).mockReturnValue(true);
    (imageFileSchema.parse as jest.Mock).mockReturnValue(true);

    validateBlog(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
