import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container, Box, Typography, Snackbar, Alert, Button,
    TextField, MenuItem, Stack, Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminNav from '../../../navbars/AdminNav';

const EmployeeTable = ({ rows, onEdit, onDelete }) => {
    const columns = [
        { field: 'Name', headerName: 'Name', flex: 1 },
        { field: 'Email', headerName: 'Email', flex: 1 },
        {
            field: 'role', headerName: 'Role', flex: 1,
            valueGetter: ({ row }) => row?.role?.RoleName || 'N/A',
        },
        {
            field: 'job', headerName: 'Job', flex: 1,
            valueGetter: ({ row }) => row?.job?.JobTitle || 'N/A',
        },
        { field: 'StartDate', headerName: 'Start Date', flex: 1 },
        {
            field: 'actions', headerName: 'Actions', width: 180,
            renderCell: ({ row }) => (
                <Stack direction="row" spacing={1} justifyContent="center" width="100%" marginTop={1.25}>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => onEdit(row)}
                        startIcon={<EditIcon />}
                        sx={{

                            borderColor: '#1976d2',
                            color: '#1976d2',
                            textTransform: 'none',
                            '&:hover': {
                                bgcolor: '#E3F2FD',
                            }
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => onDelete(row.EMPID)}
                        startIcon={<DeleteIcon />}
                        sx={{
                            borderColor: '#d32f2f',
                            color: '#d32f2f',
                            textTransform: 'none',
                            '&:hover': {
                                bgcolor: '#FFEBEE',
                            }
                        }}
                    >
                        Delete
                    </Button>
                </Stack>
            )
        },
    ];

    return (
        <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row.EMPID}
                autoHeight
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
            />
        </Paper>
    );
};

const FiltersBar = ({
    searchTerm, setSearchTerm,
    selectedRole, setSelectedRole,
    selectedJob, setSelectedJob,
    roles, jobs, onAddClick
}) => (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" width={1120}>
            <TextField
                label="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                fullWidth
            />
            <TextField
                select
                label="Filter by Role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                size="small"
                sx={{ minWidth: 180 }}
            >
                <MenuItem value="">All Roles</MenuItem>
                {roles.map((r) => (
                    <MenuItem key={r.RoleID} value={r.RoleID}>{r.RoleName}</MenuItem>
                ))}
            </TextField>
            <TextField
                select
                label="Filter by Job"
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                size="small"
                sx={{ minWidth: 180 }}
            >
                <MenuItem value="">All Jobs</MenuItem>
                {jobs.map((j) => (
                    <MenuItem key={j.JobID} value={j.JobID}>{j.JobTitle}</MenuItem>
                ))}
            </TextField>
            <Button
                variant="contained"
                onClick={onAddClick}
                sx={{
                    bgcolor: '#AE152D',
                    color: '#fff',
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#8e1025' },
                    fontWeight: 500,
                    width: 400,
                }}
            >
                + Onboard Employee
            </Button>
        </Stack>
    </Paper>
);

const People = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [roles, setRoles] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedJob, setSelectedJob] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        setEmployees([
            { EMPID: 1, Name: 'John Doe', Email: 'john.doe@example.com', role: { RoleName: 'Manager' }, job: { JobTitle: 'Software Engineer' }, StartDate: '2020-05-01' },
            { EMPID: 2, Name: 'Jane Smith', Email: 'jane.smith@example.com', role: { RoleName: 'Employee' }, job: { JobTitle: 'Product Manager' }, StartDate: '2021-03-15' },
            { EMPID: 3, Name: 'James Brown', Email: 'james.brown@example.com', role: { RoleName: 'Admin' }, job: { JobTitle: 'HR Specialist' }, StartDate: '2022-08-25' },
        ]);
        setRoles([
            { RoleID: 1, RoleName: 'Manager' },
            { RoleID: 2, RoleName: 'Employee' },
            { RoleID: 3, RoleName: 'Admin' },
        ]);
        setJobs([
            { JobID: 1, JobTitle: 'Software Engineer' },
            { JobID: 2, JobTitle: 'Product Manager' },
            { JobID: 3, JobTitle: 'HR Specialist' },
        ]);
    }, []);

    const handleAddClick = () => navigate('/onboard');
    const handleEditClick = (emp) => console.log('Edit employee:', emp);
    const handleDelete = (id) => {
        const updated = employees.filter((emp) => emp.EMPID !== id);
        setEmployees(updated);
        showSnackbar('Employee deleted');
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const filtered = employees
        .filter(e =>
            e.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.Email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(e =>
            (!selectedRole || e.role?.RoleName === roles.find(r => r.RoleID === selectedRole)?.RoleName) &&
            (!selectedJob || e.job?.JobTitle === jobs.find(j => j.JobID === selectedJob)?.JobTitle)
        );

    return (
        <>
        <AdminNav />
            <Container sx={{ mt: 10, marginLeft: 30.5 }}>
                <Typography variant="h4" gutterBottom fontWeight={600}>
                    People Directory
                </Typography>

                <FiltersBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedRole={selectedRole}
                    setSelectedRole={setSelectedRole}
                    selectedJob={selectedJob}
                    setSelectedJob={setSelectedJob}
                    roles={roles}
                    jobs={jobs}
                    onAddClick={handleAddClick}
                />

                <EmployeeTable
                    rows={filtered}
                    onEdit={handleEditClick}
                    onDelete={handleDelete}
                />

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </>
    );
};

export default People;
