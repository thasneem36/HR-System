import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import AdminNav from "../../../navbars/AdminNav";
import AddLeaveModal from '../../../components/AddLeaveModel';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack
} from '@mui/material';

const mockLeaveData = [
  { id: "L001", name: "Annual Leave", numberOfLeaves: 14, employeeType: "employee", status: "active" },
  { id: "L002", name: "Sick Leave", numberOfLeaves: 7, employeeType: "hr", status: "active" },
  { id: "L003", name: "Casual Leave", numberOfLeaves: 10, employeeType: "employee", status: "deactive" }
];

const LeaveSettingsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaveData, setLeaveData] = useState(mockLeaveData);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this leave type?")) {
      setLeaveData(leaveData.filter(leave => leave.id !== id));
    }
  };

  const handleStatusToggle = (id) => {
    setLeaveData(leaveData.map(leave =>
      leave.id === id
        ? { ...leave, status: leave.status === 'active' ? 'deactive' : 'active' }
        : leave
    ));
  };

  const handleAddLeaveType = (newLeaveType) => {
    setLeaveData([
      ...leaveData,
      { id: `L${(leaveData.length + 1).toString().padStart(3, '0')}`, ...newLeaveType, status: 'active' }
    ]);
    navigate('/leaveSettings');
  };

  const filteredData = leaveData.filter(leave =>
    leave.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AdminNav />

      <div className='container'>
      <Box sx={{ mt: 12, p: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Header & Add Button */}
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" mb={4}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Leave Settings
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor:'#ae152d',
              '&:hover':{'backgroundColor':"#cf4e63"}
            }}
            startIcon={<Plus size={18} />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Leave Type
          </Button>
        </Box>

        {/* Search Input */}
        <Box mb={4} maxWidth={400}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by Leave Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} style={{ color: 'gray' }} />
                </InputAdornment>
              )
            }}
          />
        </Box>

        {/* Table */}
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                {['ID', 'Name', 'Number of Leaves', 'Employee Type', 'Status', 'Actions'].map((header) => (
                  <TableCell key={header} align="center" sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((leave) => (
                  <TableRow key={leave.id} hover>
                    <TableCell align="center">{leave.id}</TableCell>
                    <TableCell align="center">{leave.name}</TableCell>
                    <TableCell align="center">{leave.numberOfLeaves}</TableCell>
                    <TableCell align="center">{leave.employeeType}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                        color={leave.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          size="small"
                          variant="outlined"
                          color="warning"
                          onClick={() => handleStatusToggle(leave.id)}
                        >
                          {leave.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(leave.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No leave types found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal */}
        <AddLeaveModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddLeaveType={handleAddLeaveType}
        />
      </Box>
      </div>
    </>
  );
};

export default LeaveSettingsPage;
