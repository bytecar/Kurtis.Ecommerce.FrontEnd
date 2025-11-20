import { z } from 'zod';
// Simple local validation wrappers referencing shape names from @/shared/schema
export const paginationSchema = z.object({
  page: z.preprocess((v) => v === undefined ? undefined : parseInt(String(v)), z.number().int().positive().optional()),
  limit: z.preprocess((v) => v === undefined ? undefined : parseInt(String(v)), z.number().int().positive().optional()),
  cursor: z.string().optional(),
  q: z.string().optional()
});
export const productQuerySchema = paginationSchema.extend({
  gender: z.string().optional(),
  category: z.union([z.string(), z.array(z.string())]).optional(),
  brand: z.union([z.string(), z.array(z.string())]).optional(),
  size: z.union([z.string(), z.array(z.string())]).optional(),
  rating: z.string().optional(),
  minPrice: z.preprocess((v) => v === undefined ? undefined : parseFloat(String(v)), z.number().nonnegative().optional()),
  maxPrice: z.preprocess((v) => v === undefined ? undefined : parseFloat(String(v)), z.number().optional())
});
