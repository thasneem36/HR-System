import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectIsHR } from '../store/authSlice';
import echo from '../services/echo';

/**
 * Subscribe to the private hr-feed channel (HR/admin only).
 * handlers: { 'event.name': (payload) => void, ... }
 *
 * Usage:
 *   useHrFeed({
 *     'leave.requested':    (data) => refetch(),
 *     'audit.log.created':  (data) => prependRow(data),
 *     'password.changed':   (data) => showToast(`${data.name} changed password`),
 *   });
 */
export function useHrFeed(handlers) {
  const isHR       = useSelector(selectIsHR);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!isHR) return;

    const channel = echo.private('hr-feed');

    Object.keys(handlersRef.current).forEach((event) => {
      channel.listen(`.${event}`, (data) => handlersRef.current[event]?.(data));
    });

    return () => {
      echo.leave('hr-feed');
    };
  }, [isHR]);
}
