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
    Grid,
    Paper,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { attendance } from '../services/api';

interface Attendance {
    id: number;
    employee_id: string;
    employee_name: string;
    date: string;
    check_in: string;
    check_out: string;
    status: string;
    notes: string;
}

const Attendance: React.FC = () => {
    const [rows, setRows] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
    const [summary, setSummary] = useState<any>(null);
    const [formData, setFormData] = useState({
        employee_id: '',
        date: '',
        check_in: '',
        check_out: '',
        status: 'present',
        notes: '',
    });

    const columns: GridColDef[] = [
        { field: 'employee_id', headerName: 'Employee ID', width: 130 },
        { field: 'employee_name', headerName: 'Employee Name', width: 200 },
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'check_in', headerName: 'Check In', width: 130 },
        { field: 'check_out', headerName: 'Check Out', width: 130 },
        { field: 'status', headerName: 'Status', width: 100 },
        { field: 'notes', headerName: 'Notes', width: 200 },
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

    const fetchAttendance = async () => {
        try {
            const response = await attendance.getAll();
            setRows(response.data);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const response = await attendance.getSummary();
            setSummary(response.data);
        } catch (error) {
            console.error('Error fetching attendance summary:', error);
        }
    };

    useEffect(() => {
        fetchAttendance();
        fetchSummary();
    }, []);

    const handleOpen = () => {
        setOpen(true);
        setSelectedAttendance(null);
        setFormData({
            employee_id: '',
            date: new Date().toISOString().split('T')[0],
            check_in: '',
            check_out: '',
            status: 'present',
            notes: '',
        });
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedAttendance(null);
    };

    const handleEdit = (attendance: Attendance) => {
        setSelectedAttendance(attendance);
        setFormData({
            employee_id: attendance.employee_id,
            date: attendance.date,
            check_in: attendance.check_in,
            check_out: attendance.check_out,
            status: attendance.status,
            notes: attendance.notes,
        });
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this attendance record?')) {
            try {
                await attendance.delete(id);
                fetchAttendance();
                fetchSummary();
            } catch (error) {
                console.error('Error deleting attendance:', error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedAttendance) {
                await attendance.update(selectedAttendance.id, formData);
            } else {
                await attendance.create(formData);
            }
            handleClose();
            fetchAttendance();
            fetchSummary();
        } catch (error) {
            console.error('Error saving attendance:', error);
        }
    };

    const handleCheckIn = async (employeeId: string) => {
        try {
            await attendance.checkIn(employeeId);
            fetchAttendance();
            fetchSummary();
        } catch (error) {
            console.error('Error checking in:', error);
        }
    };

    const handleCheckOut = async (employeeId: string) => {
        try {
            await attendance.checkOut(employeeId);
            fetchAttendance();
            fetchSummary();
        } catch (error) {
            console.error('Error checking out:', error);
        }
    };

    return (
        <Box sx={{ height: '100%', width: '100%', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4">Attendance Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                >
                    Add Attendance
                </Button>
            </Box>

            {summary && (
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Present Today</Typography>
                            <Typography variant="h4">{summary.present_today}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Absent Today</Typography>
                            <Typography variant="h4">{summary.absent_today}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Late Today</Typography>
                            <Typography variant="h4">{summary.late_today}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">On Leave Today</Typography>
                            <Typography variant="h4">{summary.on_leave_today}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            )}

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
                    {selectedAttendance ? 'Edit Attendance' : 'Add Attendance'}
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
                            <TextField
                                label="Date"
                                type="date"
                                value={formData.date}
                                onChange={(e) =>
                                    setFormData({ ...formData, date: e.target.value })
                                }
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Check In"
                                type="time"
                                value={formData.check_in}
                                onChange={(e) =>
                                    setFormData({ ...formData, check_in: e.target.value })
                                }
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Check Out"
                                type="time"
                                value={formData.check_out}
                                onChange={(e) =>
                                    setFormData({ ...formData, check_out: e.target.value })
                                }
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Notes"
                                multiline
                                rows={4}
                                value={formData.notes}
                                onChange={(e) =>
                                    setFormData({ ...formData, notes: e.target.value })
                                }
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {selectedAttendance ? 'Update' : 'Submit'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default Attendance; 