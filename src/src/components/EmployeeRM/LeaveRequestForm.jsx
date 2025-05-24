import React, { useState } from 'react';
import Modal from 'react-modal';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Stack
} from '@mui/material';
import { useLeaveContext } from './LeaveContext';

Modal.setAppElement('#root');

const LeaveRequestForm = ({ onClose }) => {
  const { addLeaveRequest } = useLeaveContext();

  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    numLeaveDays: '',
    reason: '',
    attachment: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addLeaveRequest({
      ...formData,
      name: 'HMM.Thasneem',
      submittedAt: new Date().toLocaleString()
    });

    onClose(); 
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      style={{
        content: {
          maxWidth: '600px',
          margin: 'auto',
          padding: '32px',
          borderRadius: '12px'
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="bold">Leave Request Form</Typography>
          <Button onClick={onClose} variant="outlined" size="small">×</Button>
        </Stack>

        {/* Leave Type */}
        <TextField
          select
          label="Leave Type"
          name="leaveType"
          value={formData.leaveType}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        >
          <MenuItem value="">Select leave type</MenuItem>
          <MenuItem value="Annual Leave">Annual Leave</MenuItem>
          <MenuItem value="Sick Leave">Sick Leave</MenuItem>
          <MenuItem value="Personal Leave">Personal Leave</MenuItem>
          <MenuItem value="Unpaid Leave">Unpaid Leave</MenuItem>
          <MenuItem value="Duty Leave">Duty Leave</MenuItem>
        </TextField>

        {/* Start Date, End Date, No. of Days */}
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Start Date"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="End Date"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Number of Leave Days"
              type="number"
              name="numLeaveDays"
              value={formData.numLeaveDays}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ min: 1 }}
            />
          </Grid>
        </Grid>

        {/* Reason */}
        <TextField
          label="Reason for Leave"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          required
        />

        {/* Attachment */}
        <Box mt={2}>
          <Typography variant="body2" gutterBottom>
            Attachment (if any)
          </Typography>
          <input
            type="file"
            name="attachment"
            onChange={handleChange}
          />
        </Box>

        {/* Actions */}
        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={4}>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button variant="contained" type="submit" sx={{ backgroundColor: '#ae152d', '&:hover': { backgroundColor: '#7f2f44' } }}>
            Submit Request
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default LeaveRequestForm;
