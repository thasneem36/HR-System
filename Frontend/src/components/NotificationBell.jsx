import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Badge, Box, Button, Chip, CircularProgress, Divider, IconButton,
  List, ListItem, ListItemText, Popover, Tooltip, Typography,
} from '@mui/material';
import {
  Notifications as BellIcon,
  NotificationsNone as BellEmptyIcon,
  DoneAll as DoneAllIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { notificationAPI } from '../services/api';
import { selectCurrentUser } from '../store/authSlice';
import echo from '../services/echo';

const TYPE_COLOR = {
  info:    'info',
  success: 'success',
  warning: 'warning',
  error:   'error',
};

const NotificationBell = () => {
  const user = useSelector(selectCurrentUser);

  const [anchorEl,       setAnchorEl]       = useState(null);
  const [notifications,  setNotifications]  = useState([]);
  const [unread,         setUnread]         = useState(0);
  const [loading,        setLoading]        = useState(true);

  // ── Fetch notifications from API ───────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    try {
      const [res, countRes] = await Promise.all([
        notificationAPI.getAll(),
        notificationAPI.unreadCount(),
      ]);
      setNotifications(res.data ?? []);
      setUnread(countRes.data?.count ?? 0);
    } catch (_) {}
    finally { setLoading(false); }
  }, []);

  // Polling fallback — catches anything WebSocket missed (every 30 s, only when tab is visible)
  useEffect(() => {
    const poll = () => { if (!document.hidden) fetchAll(); };
    const id   = setInterval(poll, 30000);
    return () => clearInterval(id);
  }, [fetchAll]);

  // Refetch immediately when user switches back to this tab
  useEffect(() => {
    const onVisible = () => { if (!document.hidden) fetchAll(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [fetchAll]);

  // ── Subscribe to Reverb WebSocket channels ─────────────────────────────────
  useEffect(() => {
    if (!user?.id) return;

    // Private channel: notifications only for THIS user
    const privateChannel = echo
      .private(`notifications.${user.id}`)
      .listen('.notification.sent', (data) => {
        setNotifications((prev) => [{ ...data, read_at: null }, ...prev]);
        setUnread((n) => n + 1);
      });

    // Public channel: notifications for ALL users (user_id = null)
    const publicChannel = echo
      .channel('notifications')
      .listen('.notification.sent', (data) => {
        setNotifications((prev) => [{ ...data, read_at: null }, ...prev]);
        setUnread((n) => n + 1);
      });

    fetchAll();

    return () => {
      echo.leave(`notifications.${user.id}`);
      echo.leave('notifications');
    };
  }, [user?.id, fetchAll]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleMarkRead = async (id) => {
    await notificationAPI.markRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
    setUnread((n) => Math.max(0, n - 1));
  };

  const handleMarkAllRead = async () => {
    await notificationAPI.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })));
    setUnread(0);
  };

  const handleDelete = async (id) => {
    const wasUnread = notifications.find((n) => n.id === id && !n.read_at);
    await notificationAPI.delete(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (wasUnread) setUnread((n) => Math.max(0, n - 1));
  };

  const handleOpen  = (e) => { setAnchorEl(e.currentTarget); };
  const handleClose = ()  => { setAnchorEl(null); };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Tooltip title="Notifications">
        <IconButton onClick={handleOpen} sx={{ mr: 1 }}>
          <Badge badgeContent={unread > 0 ? unread : null} color="error" max={99}>
            {unread > 0 ? <BellIcon /> : <BellEmptyIcon />}
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 380, maxHeight: 520, display: 'flex', flexDirection: 'column' } }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Notifications {unread > 0 && <Chip label={unread} size="small" color="error" sx={{ ml: 1 }} />}
          </Typography>
          {unread > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton size="small" onClick={handleMarkAllRead}>
                <DoneAllIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Divider />

        {/* List */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress size={24} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box py={4} textAlign="center">
              <BellEmptyIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
              <Typography color="text.secondary" variant="body2">No notifications</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {notifications.map((n, idx) => (
                <Box key={n.id}>
                  {idx > 0 && <Divider />}
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      bgcolor: n.read_at ? 'transparent' : 'action.hover',
                      transition: 'background 0.2s',
                      pr: 1,
                    }}
                    onClick={() => !n.read_at && handleMarkRead(n.id)}
                    style={{ cursor: n.read_at ? 'default' : 'pointer' }}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip
                            label={n.type ?? 'info'}
                            size="small"
                            color={TYPE_COLOR[n.type] ?? 'default'}
                            sx={{ height: 18, fontSize: 10 }}
                          />
                          <Typography variant="body2" fontWeight={n.read_at ? 400 : 700} noWrap>
                            {n.title}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" color="text.secondary" component="span" display="block">
                            {n.message}
                          </Typography>
                          <Typography variant="caption" color="text.disabled" component="span">
                            {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                          </Typography>
                        </>
                      }
                    />
                    <IconButton
                      size="small"
                      sx={{ ml: 1, alignSelf: 'center', flexShrink: 0 }}
                      onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ px: 2, py: 1, textAlign: 'center' }}>
              <Button size="small" onClick={() => { handleMarkAllRead(); handleClose(); }}>
                Clear all
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
};

export default NotificationBell;
