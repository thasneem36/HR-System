import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { leaves } from '../services/api';

interface Leave {
    id: number;
    employee_id: string;
    employee_name: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
    status: string;
}

const Leaves: React.FC = () => {
    const [rows, setRows] = useState<Leave[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
    const [leaveTypes, setLeaveTypes] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        employee_id: '',
        leave_type: '',
        start_date: '',
        end_date: '',
        reason: '',
        status: 'pending',
    });

    const columns: GridColDef[] = [
        { field: 'employee_id', headerName: 'Employee ID', width: 130 },
        { field: 'employee_name', headerName: 'Employee Name', width: 200 },
        { field: 'leave_type', headerName: 'Leave Type', width: 130 },
        { field: 'start_date', headerName: 'Start Date', width: 130 },
        { field: 'end_date', headerName: 'End Date', width: 130 },
        { field: 'reason', headerName: 'Reason', width: 200 },
        { field: 'status', headerName: 'Status', width: 100 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        size="small"
                        onClick={() => handleEdit(params.row)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const fetchLeaves = async () => {
        try {
            const response = await leaves.getAll();
            setRows(response.data);
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLeaveTypes = async () => {
        try {
            const response = await leaves.getTypes();
            setLeaveTypes(response.data);
        } catch (error) {
            console.error('Error fetching leave types:', error);
        }
    };

    useEffect(() => {
        fetchLeaves();
        fetchLeaveTypes();
    }, []);

    const handleOpen = () => {
        setOpen(true);
        setSelectedLeave(null);
        setFormData({
            employee_id: '',
            leave_type: '',
            start_date: '',
            end_date: '',
            reason: '',
            status: 'pending',
        });
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedLeave(null);
    };

    const handleEdit = (leave: Leave) => {
        setSelectedLeave(leave);
        setFormData({
            employee_id: leave.employee_id,
            leave_type: leave.leave_type,
            start_date: leave.start_date,
            end_date: leave.end_date,
            reason: leave.reason,
            status: leave.status,
        });
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this leave request?')) {
            try {
                await leaves.delete(id);
                fetchLeaves();
            } catch (error) {
                console.error('Error deleting leave:', error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedLeave) {
                await leaves.update(selectedLeave.id, formData);
            } else {
                await leaves.create(formData);
            }
            handleClose();
            fetchLeaves();
        } catch (error) {
            console.error('Error saving leave:', error);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            await leaves.approve(id);
            fetchLeaves();
        } catch (error) {
            console.error('Error approving leave:', error);
        }
    };

    const handleReject = async (id: number) => {
        try {
            await leaves.reject(id);
            fetchLeaves();
        } catch (error) {
            console.error('Error rejecting leave:', error);
        }
    };

    return (
        <Box sx={{ height: '100%', width: '100%', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4">Leave Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                >
                    Request Leave
                </Button>
            </Box>

            <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                disableSelectionOnClick
            />

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedLeave ? 'Edit Leave Request' : 'Request Leave'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Box sx={{ display: 'grid', gap: 2 }}>
                            <TextField
                                label="Employee ID"
                                value={formData.employee_id}
                                onChange={(e) =>
                                    setFormData({ ...formData, employee_id: e.target.value })
                                }
                                required
                            />
                            <FormControl fullWidth>
                                <InputLabel>Leave Type</InputLabel>
                                <Select
                                    value={formData.leave_type}
                                    label="Leave Type"
                                    onChange={(e) =>
                                        setFormData({ ...formData, leave_type: e.target.value })
                                    }
                                    required
                                >
                                    {leaveTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Start Date"
                                type="date"
                                value={formData.start_date}
                                onChange={(e) =>
                                    setFormData({ ...formData, start_date: e.target.value })
                                }
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="End Date"
                                type="date"
                                value={formData.end_date}
                                onChange={(e) =>
                                    setFormData({ ...formData, end_date: e.target.value })
                                }
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Reason"
                                multiline
                                rows={4}
                                value={formData.reason}
                                onChange={(e) =>
                                    setFormData({ ...formData, reason: e.target.value })
                                }
                                required
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {selectedLeave ? 'Update' : 'Submit'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default Leaves; 