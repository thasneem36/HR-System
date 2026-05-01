import React, { useState } from 'react';
import Modal from 'react-modal';
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Button,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

Modal.setAppElement('#root');

const calculateLeaveDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const differenceInTime = end.getTime() - start.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  return differenceInDays + 1;
};

const statusStyles = {
  Accepted: { borderColor: 'green', color: 'green' },
  Rejected: { borderColor: 'red', color: 'red' },
  Pending: { borderColor: '#ffb300', color: '#ffb300' },
};

const dummyLeaveRequests = [
  {
    id: 1,
    name: 'John Smith',
    type: 'Sick Leave',
    startDate: '2025-04-01',
    endDate: '2025-04-03',
    reportingManagerStatus: 'Pending'
  },
  {
    id: 2,
    name: 'Jane Doe',
    type: 'Annual Leave',
    startDate: '2025-04-10',
    endDate: '2025-04-15',
    reportingManagerStatus: 'Pending'
  },
  {
    id: 3,
    name: 'Mark Johnson',
    type: 'Unpaid Leave',
    startDate: '2025-03-20',
    endDate: '2025-03-22',
    reportingManagerStatus: 'Pending'
  }
];

const LeaveRequestsPage = ({ onClose }) => {
  const [leaveRequests, setLeaveRequests] = useState(dummyLeaveRequests);

  const updateStatus = (id, newStatus) => {
    const updated = leaveRequests.map((request) =>
      request.id === id
        ? { ...request, reportingManagerStatus: newStatus }
        : request
    );
    setLeaveRequests(updated);
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      style={{
        content: {
          maxWidth: '1000px',
          width: '95%',
          margin: 'auto',
          padding: '20px',
          borderRadius: '8px',
          maxHeight: '80vh',
          overflowY: 'auto',
        },
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
      }}
    >
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">Team Leave Requests</Typography>
          <IconButton onClick={onClose} size="large" sx={{ color: 'gray' }}>
            <CloseIcon fontSize="large" />
          </IconButton>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Type of Leave</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell align="center">Total Days</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaveRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.name}</TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>{request.startDate}</TableCell>
                <TableCell>{request.endDate}</TableCell>
                <TableCell align="center">
                  {calculateLeaveDays(request.startDate, request.endDate)}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={request.reportingManagerStatus}
                    variant="outlined"
                    sx={{
                      borderColor: statusStyles[request.reportingManagerStatus]?.borderColor,
                      color: statusStyles[request.reportingManagerStatus]?.color,
                      borderRadius: '16px',
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      onClick={() => updateStatus(request.id, 'Accepted')}
                      disabled={request.reportingManagerStatus !== 'Pending'}
                    >
                      Approve
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => updateStatus(request.id, 'Rejected')}
                      disabled={request.reportingManagerStatus !== 'Pending'}
                    >
                      Reject
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Modal>
  );
};

export default LeaveRequestsPage;
