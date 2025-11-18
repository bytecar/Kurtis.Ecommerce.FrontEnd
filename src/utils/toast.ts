/**
 * Very small toast abstraction for client apps.
 * In a real app hook this into your UI library (e.g. react-toastify, chakra, etc.)
 */
export function showToast(message:string, type:'success'|'error'|'info' = 'info') {
  // For demo purposes we just log - replace with real UI toast call in frontend
  console[type === 'error' ? 'error' : 'log'](`[toast:${type}] ${message}`);
}
export function mapAPIErrorToMessage(err:any) {
  if (!err) return 'Unknown error';
  if (err.message) {
    if (err.status === 0) return 'Network error — please check your connection';
    if (err.status === 401) return 'Authentication required';
    return err.message;
  }
  return String(err);
}
