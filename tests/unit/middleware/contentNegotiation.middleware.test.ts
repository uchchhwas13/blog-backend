import { Request, Response } from 'express';
import { contentNegotiation } from '../../../src/middlewares/contentNegotiation.middleware';

describe('contentNegotiation middleware', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      json: jest.fn(),
      send: jest.fn(),
      setHeader: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next()', () => {
    contentNegotiation(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });
});
