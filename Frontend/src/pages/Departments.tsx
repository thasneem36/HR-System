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
import { departments } from '../services/api';

interface Department {
    id: number;
    name: string;
    code: string;
    description: string;
    manager_id: string;
    manager_name: string;
}

const Departments: React.FC = () => {
    const [rows, setRows] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        manager_id: '',
    });

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Department Name', width: 200 },
        { field: 'code', headerName: 'Code', width: 130 },
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'manager_name', headerName: 'Manager', width: 200 },
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

    const fetchDepartments = async () => {
        try {
            const response = await departments.getAll();
            setRows(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleOpen = () => {
        setOpen(true);
        setSelectedDepartment(null);
        setFormData({
            name: '',
            code: '',
            description: '',
            manager_id: '',
        });
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedDepartment(null);
    };

    const handleEdit = (department: Department) => {
        setSelectedDepartment(department);
        setFormData({
            name: department.name,
            code: department.code,
            description: department.description,
            manager_id: department.manager_id,
        });
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await departments.delete(id);
                fetchDepartments();
            } catch (error) {
                console.error('Error deleting department:', error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedDepartment) {
                await departments.update(selectedDepartment.id, formData);
            } else {
                await departments.create(formData);
            }
            handleClose();
            fetchDepartments();
        } catch (error) {
            console.error('Error saving department:', error);
        }
    };

    return (
        <Box sx={{ height: '100%', width: '100%', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4">Department Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                >
                    Add Department
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
                    {selectedDepartment ? 'Edit Department' : 'Add Department'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Box sx={{ display: 'grid', gap: 2 }}>
                            <TextField
                                label="Department Name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                required
                            />
                            <TextField
                                label="Code"
                                value={formData.code}
                                onChange={(e) =>
                                    setFormData({ ...formData, code: e.target.value })
                                }
                                required
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
                                label="Manager ID"
                                value={formData.manager_id}
                                onChange={(e) =>
                                    setFormData({ ...formData, manager_id: e.target.value })
                                }
                                required
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {selectedDepartment ? 'Update' : 'Submit'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default Departments; 