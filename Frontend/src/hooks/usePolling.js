import { useEffect } from 'react';

/**
 * Poll `callback` every `intervalMs` milliseconds, but only when the tab is visible.
 * Pauses automatically when the user switches away — resumes instantly on return.
 *
 * Usage:
 *   usePolling(fetchData, 30000);  // refresh every 30 s
 */
export function usePolling(callback, intervalMs = 30000) {
  useEffect(() => {
    const tick = () => { if (!document.hidden) callback(); };

    // Also refetch when user returns to this tab
    const onVisible = () => { if (!document.hidden) callback(); };
    document.addEventListener('visibilitychange', onVisible);

    const id = setInterval(tick, intervalMs);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [callback, intervalMs]);
}
