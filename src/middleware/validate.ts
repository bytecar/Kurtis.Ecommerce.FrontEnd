import type { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
export function validateQuery(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid query', details: result.error.format() });
    }
    // attach parsed query
    (req as any).validatedQuery = result.data;
    next();
  };
}
export function validateBody(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid body', details: result.error.format() });
    }
    (req as any).validatedBody = result.data;
    next();
  };
}
