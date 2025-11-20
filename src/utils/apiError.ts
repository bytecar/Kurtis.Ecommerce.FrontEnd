export class APIError extends Error {
  status: number;
  code?: string;
  details?: any;
  constructor(message: string, status = 500, code?: string, details?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
export function normalizeError(err:any): APIError {
  if (!err) return new APIError('Unknown error',500);
  if (err instanceof APIError) return err;
  if (err && err.status && err.message) return new APIError(err.message, err.status, err.code, err.body || err.details);
  // Fallback for fetch errors which may have body
  return new APIError(err.message || String(err), err.status || 500, err.code, err.body || err);
}
