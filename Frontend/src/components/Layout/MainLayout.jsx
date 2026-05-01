import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar, Avatar, Box, CssBaseline, Divider, Drawer,
  IconButton, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Menu, MenuItem, Toolbar, Typography,
  useMediaQuery, useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  CalendarToday as CalendarTodayIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp as LogoutIcon,
  AccountBalance as PayrollIcon,
  History as AuditIcon,
  Folder as DocumentsIcon,
} from '@mui/icons-material';
import { logout, selectCurrentUser, selectIsHR } from '../../store/authSlice';
import { authAPI } from '../../services/api';
import NotificationBell from '../NotificationBell';

const DRAWER_WIDTH = 240;
const BRAND_COLOR  = '#941936';

// Menu items visible to ALL logged-in users
const baseMenuItems = [
  { text: 'Dashboard',  icon: <DashboardIcon />,      path: '/dashboard' },
  { text: 'Attendance', icon: <EventNoteIcon />,       path: '/attendance' },
  { text: 'Leaves',     icon: <CalendarTodayIcon />,   path: '/leaves' },
  { text: 'Documents',  icon: <DocumentsIcon />,       path: '/documents' },
];

// Menu items visible only to HR Manager and Super Admin
const hrMenuItems = [
  { text: 'Employees',   icon: <PeopleIcon />,    path: '/employees' },
  { text: 'Departments', icon: <BusinessIcon />,  path: '/departments' },
  { text: 'Jobs',        icon: <WorkIcon />,      path: '/jobs' },
  { text: 'Payroll',     icon: <PayrollIcon />,   path: '/payroll' },
  { text: 'Reports',     icon: <ReportsIcon />,   path: '/reports' },
  { text: 'Audit Log',   icon: <AuditIcon />,     path: '/audit-log' },
  { text: 'Settings',    icon: <SettingsIcon />,  path: '/settings' },
];

const ROLE_LABELS = {
  super_admin: 'Super Admin',
  hr_manager:  'HR Manager',
  employee:    'Employee',
};

const MainLayout = () => {
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [anchorEl, setAnchorEl]         = useState(null);

  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user  = useSelector(selectCurrentUser);
  const isHR  = useSelector(selectIsHR);

  const menuItems = isHR ? [...baseMenuItems, ...hrMenuItems] : baseMenuItems;

  const currentPage = menuItems.find((m) => location.pathname.startsWith(m.path))?.text || 'HR System';

  const handleLogout = async () => {
    try { await authAPI.logout(); } catch (_) {}
    dispatch(logout());
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Brand */}
      <Box sx={{ p: 2, bgcolor: BRAND_COLOR }}>
        <Typography variant="h6" color="white" fontWeight={700}>University HR</Typography>
        <Typography variant="caption" color="rgba(255,255,255,0.7)">Management System</Typography>
      </Box>

      {/* Nav items */}
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
                selected={active}
                sx={{
                  mx: 1, borderRadius: 1,
                  '&.Mui-selected': { bgcolor: `${BRAND_COLOR}18`, color: BRAND_COLOR },
                  '&.Mui-selected .MuiListItemIcon-root': { color: BRAND_COLOR },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User info at bottom */}
      <Divider />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: BRAND_COLOR, fontSize: 14 }}>
          {user?.name?.[0]?.toUpperCase()}
        </Avatar>
        <Box overflow="hidden">
          <Typography variant="body2" fontWeight={600} noWrap>{user?.name}</Typography>
          <Typography variant="caption" color="text.secondary">{ROLE_LABELS[user?.role] || user?.role}</Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml:    { sm: `${DRAWER_WIDTH}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" fontWeight={600} flexGrow={1}>{currentPage}</Typography>

          <NotificationBell />

          {/* User menu */}
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: BRAND_COLOR, fontSize: 14 }}>
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }}>
              <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} /> My Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { setAnchorEl(null); handleLogout(); }} sx={{ color: 'error.main' }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '64px',
          bgcolor: '#f8f9fa',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
