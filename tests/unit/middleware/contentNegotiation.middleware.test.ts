import { Request, Response } from 'express';
import { contentNegotiation } from '../../../src/middlewares/contentNegotiation.middleware';
import * as js2xmlparser from 'js2xmlparser';

jest.mock('js2xmlparser', () => ({
  parse: jest.fn().mockReturnValue('<response><foo>bar</foo></response>'),
}));

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
    const result = res.json(payload);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json; charset=utf-8');
    expect(result).toBe('json called');
    expect(res.send).not.toHaveBeenCalled();
  });

  it('should return XML if Accept header includes application/xml', () => {
    req.headers.accept = 'application/xml';

    contentNegotiation(req as Request, res as Response, next);

    const payload = {};
    const result = res.json(payload);

    expect(js2xmlparser.parse).toHaveBeenCalledWith('response', payload, expect.any(Object));
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/xml; charset=utf-8');
    expect(res.send).toHaveBeenCalledWith('<response><foo>bar</foo></response>');
    expect(result).toBe('send called');
  });

  it('should default to JSON if Accept header is missing', () => {
    delete req.headers.accept;
    const originalJsonMock = res.json;

    contentNegotiation(req as Request, res as Response, next);

    const payload = { foo: 'bar' };
    res.json(payload);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json; charset=utf-8');
    expect(res.send).not.toHaveBeenCalled();
    expect(originalJsonMock).toHaveBeenCalledWith(payload);
  });
});
