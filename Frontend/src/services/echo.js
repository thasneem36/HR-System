import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const scheme = import.meta.env.VITE_REVERB_SCHEME ?? 'http';

const echo = new Echo({
  broadcaster:       'reverb',
  key:               import.meta.env.VITE_REVERB_APP_KEY,
  wsHost:            import.meta.env.VITE_REVERB_HOST  ?? 'localhost',
  wsPort:            import.meta.env.VITE_REVERB_PORT  ?? 8080,
  wssPort:           import.meta.env.VITE_REVERB_PORT  ?? 8080,
  scheme,
  forceTLS:          scheme === 'https',
  enabledTransports: scheme === 'https' ? ['wss'] : ['ws'],
  // Detect dead connections faster — default pongTimeout is 30 s which causes
  // the 2-4 minute reconnect delay users see on the notification bell.
  activityTimeout:   15000,   // send a ping if no traffic for 15 s
  pongTimeout:       5000,    // treat as disconnected if no pong within 5 s
  authEndpoint: `${import.meta.env.VITE_API_URL ?? 'http://localhost:8000'}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
    },
  },
});

/**
 * Call this after login / token refresh so private-channel auth keeps working.
 * Usage: updateEchoToken(store.getState().auth.token)
 */
export function updateEchoToken(token) {
  if (echo.connector?.pusher?.config?.auth?.headers) {
    echo.connector.pusher.config.auth.headers.Authorization = `Bearer ${token ?? ''}`;
  }
}

export default echo;
