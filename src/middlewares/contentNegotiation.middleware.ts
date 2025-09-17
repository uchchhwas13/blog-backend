import { Request, Response, NextFunction } from 'express';
import { parse } from 'js2xmlparser';

function toXml(obj: unknown): string {
  return parse('response', obj, {
    declaration: { include: true, encoding: 'UTF-8' },
    format: { doubleQuotes: true, indent: '  ', newline: '\n' },
  });
}

function wantsXml(acceptHeader?: string) {
  if (!acceptHeader) return false;
  return acceptHeader.includes('application/xml') || acceptHeader.includes('text/xml');
}

export function contentNegotiation(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json;

  res.json = function (obj: unknown) {
    if (wantsXml(req.headers.accept)) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      return res.send(toXml(obj));
    } else {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return originalJson.call(this, obj);
    }
  };

  next();
}
