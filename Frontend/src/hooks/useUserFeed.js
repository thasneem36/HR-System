import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/authSlice';
import echo from '../services/echo';

/**
 * Subscribe to the private user-feed.{userId} channel (own user only).
 * handlers: { 'event.name': (payload) => void, ... }
 *
 * Usage:
 *   useUserFeed({
 *     'leave.status.updated': (data) => refetch(),
 *   });
 */
export function useUserFeed(handlers) {
  const user        = useSelector(selectCurrentUser);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!user?.id) return;

    const channelName = `user-feed.${user.id}`;
    const channel     = echo.private(channelName);

    Object.keys(handlersRef.current).forEach((event) => {
      channel.listen(`.${event}`, (data) => handlersRef.current[event]?.(data));
    });

    return () => {
      echo.leave(channelName);
    };
  }, [user?.id]);
}
