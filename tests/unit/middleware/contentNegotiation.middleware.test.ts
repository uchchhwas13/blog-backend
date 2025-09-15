import { Request, Response } from 'express';
import { contentNegotiation } from '../../../src/middlewares/contentNegotiation.middleware';

describe('contentNegotiation middleware', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      json: jest.fn().mockReturnValue('json called'),
      send: jest.fn().mockReturnValue('send called'),
      setHeader: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next()', () => {
    contentNegotiation(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return JSON if Accept header is application/json', () => {
    req.headers.accept = 'application/json';

    contentNegotiation(req as Request, res as Response, next);

    const payload = { foo: 'bar' };
    const result = (res.json as jest.Mock)(payload);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json; charset=utf-8');
    expect(result).toBe('json called');
    expect(res.send).not.toHaveBeenCalled();
  });
});
