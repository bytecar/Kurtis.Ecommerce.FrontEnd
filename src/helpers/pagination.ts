export interface PageRequest {
  page?: number;
  limit?: number;
  cursor?: string | null;
}
export interface PageResponse<T> {
  data: T[];
  page?: number;
  limit?: number;
  total?: number;
  nextCursor?: string | null;
}
export function buildQuery(params: PageRequest & Record<string, any>) {
  const qp = new URLSearchParams();
  if (params.page !== undefined) qp.set('page', String(params.page));
  if (params.limit !== undefined) qp.set('limit', String(params.limit));
  if (params.cursor !== undefined && params.cursor !== null) qp.set('cursor', String(params.cursor));
  Object.keys(params).forEach(k=>{
    if (['page','limit','cursor'].includes(k)) return;
    const v = (params as any)[k];
    if (v !== undefined && v !== null) qp.set(k, String(v));
  });
  const s = qp.toString();
  return s ? `?${s}` : '';
}
