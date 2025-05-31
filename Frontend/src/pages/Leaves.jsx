import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
} from '@mui/icons-material';
import { leaveAPI } from '../services/api';

const LeaveDialog = ({ open, handleClose, leave, onSubmit }) => {
  const [formData, setFormData] = useState({
    EMP_ID: '',
    ELP_ID: '',
    start_date: '',
    end_date: '',
    Reason: '',
    Cover_up: '',
    AttachmentForLeave: '',
  });

  useEffect(() => {
    if (leave) {
      setFormData(leave);
    }
  }, [leave]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{leave ? 'Edit Leave Request' : 'New Leave Request'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employee ID"
                name="EMP_ID"
                value={formData.EMP_ID}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Leave Plan ID"
                name="ELP_ID"
                value={formData.ELP_ID}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason"
                name="Reason"
                multiline
                rows={4}
                value={formData.Reason}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cover Up"
                name="Cover_up"
                multiline
                rows={2}
                value={formData.Cover_up}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Attachment"
                name="AttachmentForLeave"
                value={formData.AttachmentForLeave}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {leave ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await leaveAPI.getAll();
      setLeaves(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddLeave = () => {
    setSelectedLeave(null);
    setDialogOpen(true);
  };

  const handleEditLeave = (leave) => {
    setSelectedLeave(leave);
    setDialogOpen(true);
  };

  const handleDeleteLeave = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      try {
        await leaveAPI.delete(id);
        fetchLeaves();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleApproveLeave = async (id) => {
    try {
      await leaveAPI.approve(id);
      fetchLeaves();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRejectLeave = async (id) => {
    try {
      await leaveAPI.reject(id);
      fetchLeaves();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedLeave) {
        await leaveAPI.update(selectedLeave.Leave_ID, formData);
      } else {
        await leaveAPI.create(formData);
      }
      setDialogOpen(false);
      fetchLeaves();
    } catch (err) {
      setError(err.message);
    }
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Leave Requests</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddLeave}
        >
          New Leave Request
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaves
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((leave) => (
                <TableRow key={leave.Leave_ID}>
                  <TableCell>{leave.EMP_ID}</TableCell>
                  <TableCell>{leave.start_date}</TableCell>
                  <TableCell>{leave.end_date}</TableCell>
                  <TableCell>
                    {calculateDuration(leave.start_date, leave.end_date)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={leave.Leave_Status}
                      color={
                        leave.Leave_Status === 'approved'
                          ? 'success'
                          : leave.Leave_Status === 'pending'
                          ? 'warning'
                          : 'error'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditLeave(leave)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteLeave(leave.Leave_ID)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    {leave.Leave_Status === 'pending' && (
                      <>
                        <IconButton
                          color="success"
                          onClick={() => handleApproveLeave(leave.Leave_ID)}
                        >
                          <ApproveIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleRejectLeave(leave.Leave_ID)}
                        >
                          <RejectIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={leaves.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <LeaveDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        leave={selectedLeave}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default Leaves; 