import { Request, Response, NextFunction } from 'express';
import { parse } from 'js2xmlparser';

export function contentNegotiation(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json;

  res.json = function (obj: unknown) {
    const acceptHeader = req.headers.accept || 'application/json';
    if (acceptHeader.includes('application/xml') || acceptHeader.includes('text/xml')) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');

      const xmlResponse = parse('response', obj, {
        declaration: {
          include: true,
          encoding: 'UTF-8',
        },
        format: {
          doubleQuotes: true,
          indent: '  ',
          newline: '\n',
        },
      });

      return res.send(xmlResponse);
    } else {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return originalJson.call(this, obj);
    }
  };

  next();
}
