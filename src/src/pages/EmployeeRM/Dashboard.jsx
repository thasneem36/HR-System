import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal
} from '@mui/material';
import {
  AccountCircle
} from '@mui/icons-material';
import NotificationsIcon from '@mui/icons-material/Notifications';

import LeaveRequestForm from '../../components/EmployeeRM/LeaveRequestForm';
import LeaveRequestsPage from '../../components/EmployeeRM/LeaveRequestsPage';
import Profile from '../../components/EmployeeRM/Profile';
import Logo from '../../assets/EmployeeRM/Logo.png';
import profilePic from '../../assets/EmployeeRM/profile.jpg';
import { useLeaveContext } from '../../components/EmployeeRM/LeaveContext';

function Dashboard() {
  const [activeComponent, setActiveComponent] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const {
    leaveRequests,
    notifications,
    successMessage,
    setSuccessMessage
  } = useLeaveContext();

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const leaveStats = {
    total: 10,
    balance: 2,
    accepted: 5,
    rejected: 4,
    pending: 3
  };

  return (
    <Box
      sx={{
        bgcolor: 'white',
        minHeight: '100vh',
        px: 4,
        py: 5,
        width: '80%',
        mx: 'auto',
      }}
    >
      {/* Top Bar */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <img
            src={Logo}
            alt="Logo"
            style={{ height: 60, objectFit: 'contain' }}
          />
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <NotificationsIcon
            sx={{ cursor: 'pointer' }}
            onClick={() => setShowNotifications(true)}
          />
          
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ cursor: 'pointer' }}
            onClick={() => setActiveComponent('profile')}
          >
            <AccountCircle />
            <Box>
              <Typography fontWeight="bold">HMM.Thasneem</Typography>
            </Box>
          </Stack>
        </Stack>
      </Stack>

      <hr />

      {/* Success Message */}
      {successMessage && (
        <Box
          sx={{
            bgcolor: '#d4edda',
            color: '#155724',
            p: 2,
            borderRadius: 2,
            mb: 3
          }}
        >
          <Typography>{successMessage}</Typography>
        </Box>
      )}

      {/* Profile Section */}
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <Typography><strong>ID:</strong> 123456</Typography>
            <Typography><strong>Name:</strong> Thasneem</Typography>
            <Typography><strong>Department:</strong> Dev Team</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6} textAlign="left">
          <Box
            component="img"
            src={profilePic}
            alt="Profile"
            sx={{
              width: 120,
              height: 120,
              borderRadius: 2,
              objectFit: 'cover'
            }}
          />
        </Grid>
      </Grid>

      {/* Leave Summary */}
      <Stack
        direction="row"
        spacing={2}
        mt={5}
        flexWrap="wrap"
        alignItems="center"
        justifyContent="center"
      >
        <Button
          variant="contained"
          onClick={() => setActiveComponent('requestLeave')}
          sx={{
            backgroundColor: '#ae152d',
            '&:hover': {
              backgroundColor: '#7f2f44'
            },
            textTransform: 'none'
          }}
        >
          Request Leave
        </Button>

        {[['total leaves', leaveStats.total],
          ['Balance', leaveStats.balance],
          ['Accepted', leaveStats.accepted],
          ['Rejected', leaveStats.rejected],
          ['pending', leaveStats.pending]
        ].map(([label, value]) => (
          <Paper
            key={label}
            elevation={1}
            sx={{
              p: 2,
              minWidth: 120,
              textAlign: 'center',
              bgcolor: '#e0e0e0'
            }}
          >
            <Typography variant="body2">{label}</Typography>
            <Typography variant="h6" fontWeight="bold">{value}</Typography>
          </Paper>
        ))}
      </Stack>

      {/* Recent Leave Table */}
      <Typography variant="h6" mt={6} mb={2} align="center">
        Recent Leave
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Start Date</strong></TableCell>
              <TableCell><strong>End Date</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>No. of leave days</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...leaveRequests]
              .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
              .map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.startDate}</TableCell>
                  <TableCell>{row.endDate}</TableCell>
                  <TableCell>{row.leaveType}</TableCell>
                  <TableCell>
                    {Math.ceil(
                      (new Date(row.endDate) - new Date(row.startDate)) /
                      (1000 * 60 * 60 * 24)
                    ) + 1}
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        color:
                          row.reportingManagerStatus === 'Accepted'
                            ? 'green'
                            : row.reportingManagerStatus === 'Rejected'
                            ? 'red'
                            : '#ff9800' // pending
                      }}
                    >
                      {row.reportingManagerStatus || 'Pending'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>

        </Table>
      </TableContainer>

      {/* Leave Details Button */}
      <Box textAlign="right" mt={2}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#ae152d',
            '&:hover': {
              backgroundColor: '#7f2f44'
            },
            textTransform: 'none'
          }}
          onClick={() => setActiveComponent('viewLeaveRequests')}
        >
          View Leave Requests
        </Button>
      </Box>

      {/* Conditional Components */}
      <Box mt={3}>
        {activeComponent === 'requestLeave' && (
          <LeaveRequestForm onClose={() => setActiveComponent(null)} />
        )}
        {activeComponent === 'viewLeaveRequests' && (
          <LeaveRequestsPage leaveRequests={[]} onClose={() => setActiveComponent(null)} />
        )}
        <Profile open={activeComponent === 'profile'} onClose={() => setActiveComponent(null)} />
      </Box>

      {/* Notification Modal */}
      <Modal
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2, minWidth: 400 }}>
          <Typography variant="h6" gutterBottom>Notifications</Typography>
          {notifications.length === 0 ? (
            <Typography>No notifications yet.</Typography>
          ) : (
            notifications.map((note, index) => (
              <Box key={index} sx={{ mb: 2, borderBottom: '1px solid #ccc', pb: 1 }}>
                <Typography>{note.message}</Typography>
                <Typography variant="caption" color="text.secondary">{note.timestamp}</Typography>
              </Box>
            ))
          )}
          <Button onClick={() => setShowNotifications(false)} sx={{ mt: 2 }} variant="outlined">
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default Dashboard;
