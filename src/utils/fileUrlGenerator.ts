const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
export const buildFileUrl = (relativePath: string): string => {
  return `${BASE_URL}${relativePath}`;
};
