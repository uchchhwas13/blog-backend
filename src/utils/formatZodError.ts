import { ZodError } from 'zod';

export function formatZodError(error: ZodError) {
  return error._zod.def.map((err) => {
    return {
      field: err.path.join('.'),
      message: err.message,
    };
  });
}
