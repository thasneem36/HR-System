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
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { holidays } from '../services/api';

interface Holiday {
    id: number;
    name: string;
    date: string;
    description: string;
    type: string;
}

const Holidays: React.FC = () => {
    const [rows, setRows] = useState<Holiday[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        description: '',
        type: 'public',
    });

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Holiday Name', width: 200 },
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'type', headerName: 'Type', width: 130 },
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

    const fetchHolidays = async () => {
        try {
            const response = await holidays.getAll();
            setRows(response.data);
        } catch (error) {
            console.error('Error fetching holidays:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHolidays();
    }, []);

    const handleOpen = () => {
        setOpen(true);
        setSelectedHoliday(null);
        setFormData({
            name: '',
            date: '',
            description: '',
            type: 'public',
        });
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedHoliday(null);
    };

    const handleEdit = (holiday: Holiday) => {
        setSelectedHoliday(holiday);
        setFormData({
            name: holiday.name,
            date: holiday.date,
            description: holiday.description,
            type: holiday.type,
        });
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this holiday?')) {
            try {
                await holidays.delete(id);
                fetchHolidays();
            } catch (error) {
                console.error('Error deleting holiday:', error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedHoliday) {
                await holidays.update(selectedHoliday.id, formData);
            } else {
                await holidays.create(formData);
            }
            handleClose();
            fetchHolidays();
        } catch (error) {
            console.error('Error saving holiday:', error);
        }
    };

    return (
        <Box sx={{ height: '100%', width: '100%', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4">Holiday Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                >
                    Add Holiday
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
                    {selectedHoliday ? 'Edit Holiday' : 'Add Holiday'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Box sx={{ display: 'grid', gap: 2 }}>
                            <TextField
                                label="Holiday Name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
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
                                label="Description"
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                required
                            />
                            <TextField
                                label="Type"
                                value={formData.type}
                                onChange={(e) =>
                                    setFormData({ ...formData, type: e.target.value })
                                }
                                required
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {selectedHoliday ? 'Update' : 'Submit'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default Holidays; 