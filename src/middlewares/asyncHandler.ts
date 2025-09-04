import { NextFunction, Request, Response } from 'express';
import { RequestHandler } from 'express';

export const asyncHandler = <Params, ResBody, ReqBody, ReqQuery, ReturnType>(
  requestHandler: (
    req: Request<Params, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction,
  ) => Promise<ReturnType>,
): RequestHandler<Params, ResBody, ReqBody, ReqQuery> => {
  return (req, res, next) => {
    const val = Promise.resolve(requestHandler(req, res, next)).catch(next);
    return Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};
