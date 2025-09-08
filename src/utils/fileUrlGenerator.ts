import { Request } from 'express';

export const buildFileUrl = (req: Request, relativePath: string): string => {
  return `${req.protocol}://${req.get('host')}${relativePath}`;
};
