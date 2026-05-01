import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Box,
  Typography
} from '@mui/material';
import { X } from 'lucide-react';

const AddLeaveModal = ({ isOpen, onClose, onAddLeaveType }) => {
  const [formData, setFormData] = useState({
    leaveTypeName: '',
    numberOfLeaves: '',
    employeeType: 'employee',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = formData.leaveTypeName.trim();

    if (trimmedName === '' || Number(formData.numberOfLeaves) <= 0) {
      alert('Please provide a valid leave name and number of leaves greater than 0.');
      return;
    }

    const newLeaveType = new LeaveType({
      ...formData,
      leaveTypeName: trimmedName,
    });

    onAddLeaveType(newLeaveType);
    onClose();
    setFormData({
      leaveTypeName: '',
      numberOfLeaves: '',
      employeeType: 'employee',
    });
  };

  return (
    <Dialog
  open={isOpen}
  onClose={onClose}
  fullWidth
  maxWidth="sm"
  PaperProps={{ sx: { maxHeight: '100vh'} }}
  
>

      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" color="error" fontWeight="bold">
          Create New Leave Type
        </Typography>
        <IconButton onClick={onClose}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Leave Type Name"
              variant="outlined"
              fullWidth
              required
              autoFocus
              value={formData.leaveTypeName}
              onChange={(e) => setFormData({ ...formData, leaveTypeName: e.target.value })}
            />
            <TextField
              label="Number of Leaves"
              type="number"
              variant="outlined"
              fullWidth
              required
              inputProps={{ min: 1 }}
              value={formData.numberOfLeaves}
              onChange={(e) => setFormData({ ...formData, numberOfLeaves: e.target.value })}
            />
            <TextField
              select
              label="Employee Type"
              variant="outlined"
              fullWidth
              value={formData.employeeType}
              onChange={(e) => setFormData({ ...formData, employeeType: e.target.value })}
            >
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="hr">HR</MenuItem>
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="error">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

class LeaveType {
  constructor({ leaveTypeName, numberOfLeaves, employeeType }) {
    this.name = leaveTypeName;
    this.numberOfLeaves = Number(numberOfLeaves);
    this.employeeType = employeeType;
  }
}

export default AddLeaveModal;