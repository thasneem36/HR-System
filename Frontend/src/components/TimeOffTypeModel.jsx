import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
} from '@mui/material';
import { X } from 'lucide-react';

const TimeOffTypeModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'paid',
    unit: 'days',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    twoStepApproval: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLeave = new LeaveType(formData);
    onAdd(newLeave);
    onClose();
    setFormData({
      name: '',
      description: '',
      type: 'paid',
      unit: 'days',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      twoStepApproval: false,
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { maxHeight: '100vh' } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" color="error" fontWeight="bold">
          Create New Time-off Type
        </Typography>
        <IconButton onClick={onClose}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3} height={500} >
            {/* Name and Description stacked vertically */}
            <Grid item xs={12} width={400}>
              <TextField
                label="Name"
                fullWidth
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} width={500}>
              <TextField
                label="Description"
                fullWidth
                required
                multiline
                minRows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>

            {/* Type & Unit */}
            <Grid item xs={12} sm={6} width={250}>
              <FormControl fullWidth >
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  label="Type"
                >
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="unpaid">Unpaid</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} width={250}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  label="Unit"
                >
                  <MenuItem value="days">Days</MenuItem>
                  <MenuItem value="hours">Hours</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Dynamic Date or Time inputs */}
            {formData.unit === 'days' ? (
              <>
                <Grid item xs={12} sm={6} width={250} >
                  <TextField
                    label="Start Date"
                    type="date"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6} width={250} >
                  <TextField
                    label="End Date"
                    type="date"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} sm={6} width={250}>
                  <TextField
                    label="Start Time"
                    type="time"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6} width={250}>
                  <TextField
                    label="End Time"
                    type="time"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </Grid>
              </>
            )}

            {/* Two-step approval */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.twoStepApproval}
                    onChange={(e) => setFormData({ ...formData, twoStepApproval: e.target.checked })}
                  />
                }
                label="Two step approval"
              />
            </Grid>
          </Grid>
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
  constructor({ name, description, type, unit, startDate, endDate, startTime, endTime, twoStepApproval }) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.unit = unit;
    this.startDate = startDate;
    this.endDate = endDate;
    this.startTime = startTime;
    this.endTime = endTime;
    this.twoStepApproval = twoStepApproval;
    this.numberOfLeaves = unit === 'days'
      ? 1
      : (endTime && startTime ? calculateHourDifference(startTime, endTime) : 1);
  }
}

function calculateHourDifference(start, end) {
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  const diff = (endH * 60 + endM) - (startH * 60 + startM);
  return Math.max(1, Math.ceil(diff / 60));
}

export default TimeOffTypeModal;