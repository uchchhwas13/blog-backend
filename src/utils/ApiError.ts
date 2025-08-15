export class ApiError extends Error {
  public statusCode: number;
  public errors?: unknown;
  public success: boolean;

  constructor(statusCode: number, message: string, errors?: unknown, stack?: string) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
