import { Request } from 'express';

export const buildFileUrl = (req: Request, filename: string): string => {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};
