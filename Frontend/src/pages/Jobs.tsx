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
import { jobs } from '../services/api';

interface Job {
    id: number;
    title: string;
    code: string;
    department_id: string;
    department_name: string;
    description: string;
    requirements: string;
    salary_range: string;
}

const Jobs: React.FC = () => {
    const [rows, setRows] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        department_id: '',
        description: '',
        requirements: '',
        salary_range: '',
    });

    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Job Title', width: 200 },
        { field: 'code', headerName: 'Code', width: 130 },
        { field: 'department_name', headerName: 'Department', width: 200 },
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'salary_range', headerName: 'Salary Range', width: 150 },
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

    const fetchJobs = async () => {
        try {
            const response = await jobs.getAll();
            setRows(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleOpen = () => {
        setOpen(true);
        setSelectedJob(null);
        setFormData({
            title: '',
            code: '',
            department_id: '',
            description: '',
            requirements: '',
            salary_range: '',
        });
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedJob(null);
    };

    const handleEdit = (job: Job) => {
        setSelectedJob(job);
        setFormData({
            title: job.title,
            code: job.code,
            department_id: job.department_id,
            description: job.description,
            requirements: job.requirements,
            salary_range: job.salary_range,
        });
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this job position?')) {
            try {
                await jobs.delete(id);
                fetchJobs();
            } catch (error) {
                console.error('Error deleting job:', error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedJob) {
                await jobs.update(selectedJob.id, formData);
            } else {
                await jobs.create(formData);
            }
            handleClose();
            fetchJobs();
        } catch (error) {
            console.error('Error saving job:', error);
        }
    };

    return (
        <Box sx={{ height: '100%', width: '100%', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4">Job Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                >
                    Add Job
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
                    {selectedJob ? 'Edit Job' : 'Add Job'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Box sx={{ display: 'grid', gap: 2 }}>
                            <TextField
                                label="Job Title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
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
                                label="Department ID"
                                value={formData.department_id}
                                onChange={(e) =>
                                    setFormData({ ...formData, department_id: e.target.value })
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
                                label="Requirements"
                                multiline
                                rows={4}
                                value={formData.requirements}
                                onChange={(e) =>
                                    setFormData({ ...formData, requirements: e.target.value })
                                }
                                required
                            />
                            <TextField
                                label="Salary Range"
                                value={formData.salary_range}
                                onChange={(e) =>
                                    setFormData({ ...formData, salary_range: e.target.value })
                                }
                                required
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {selectedJob ? 'Update' : 'Submit'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default Jobs; 