<<<<<<< HEAD
import type { PageRequest, PageResponse } from '../helpers/pagination.js';
import { showToast, mapAPIErrorToMessage } from './toast.js';
=======
import type { PageRequest, PageResponse } from '../helpers/pagination';
import { showToast, mapAPIErrorToMessage } from './toast';
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
/**
 * Example client helper to fetch pages and accumulate results for infinite scroll
 * fetchPage is a function that accepts PageRequest and returns PageResponse<T>
 */
export async function infiniteScrollFetcher<T>(fetchPage:(req:PageRequest)=>Promise<PageResponse<T>>, initialReq:PageRequest, onPage:(items:T[])=>void) {
  try {
    let req = { ...initialReq };
    while (true) {
      const res = await fetchPage(req);
      onPage(res.data || []);
      if (!res.nextCursor && (res.page === undefined || (req.page !== undefined && req.page! * (res.limit||0) >= (res.total||0)))) break;
      // advance using cursor or page
      if (res.nextCursor) req.cursor = res.nextCursor;
      else req.page = (req.page || 1) + 1;
    }
  } catch (err:any) {
    showToast(mapAPIErrorToMessage(err),'error');
    throw err;
  }
}
