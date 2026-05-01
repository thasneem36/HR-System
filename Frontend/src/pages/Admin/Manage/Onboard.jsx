import React, { useState, useEffect } from 'react';
import {
    Avatar, Box, Button, Paper, Typography, Snackbar, Alert,
    Stack, Stepper, Step, StepLabel, Divider, CircularProgress
} from '@mui/material';
import axios from 'axios';

import BasicInfo from './onboard/BasicInfo';
import ContactInfo from './onboard/ContactInfo';
import UserInfo from './onboard/UserInfo';
import AdminNav from '../../../navbars/AdminNav';

const steps = ['Basic Info', 'Contact Info', 'User Credentials'];

const Onboard = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [form, setForm] = useState({
        firstName: '', lastName: '', department: '', role: '', employmentType: '',
        startDate: '', reportingManager: '', job_id: '', nic: '', dob: '',
        email: '', phone: '',
        phoneNumbers: [],
        streetNo: '',
        streetLine: '',
        city: '',
        district: '',
        province: '',
        usernameOrEmail: '',
        password: '',
        confirmPassword: ''
    });

    const [roles, setRoles] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [managers, setManagers] = useState([]);
    const [managerQuery, setManagerQuery] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        axios.get('http://localhost:8000/api/dropdown/roles').then(res => setRoles(res.data));
        axios.get('http://localhost:8000/api/dropdown/jobs').then(res => setJobs(res.data));
        axios.get('http://localhost:8000/api/dropdown/reporting-managers').then(res => setManagers(res.data));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setFormErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const errors = {};
        if (!form.firstName) errors.firstName = 'First name is required';
        if (!form.lastName) errors.lastName = 'Last name is required';
        if (!form.role) errors.role = 'Role is required';
        if (!form.employmentType) errors.employmentType = 'Employment type is required';
        if (!form.startDate) errors.startDate = 'Start date is required';
        if (!form.job_id) errors.job_id = 'Job is required';
        if (!form.reportingManager) errors.reportingManager = 'Manager is required';
        if (!form.nic) errors.nic = 'NIC is required';
        return true;
    };

    const handleNICExtract = () => {
        const nic = form.nic;
        let year, day;

        if (/^\d{9}[vVxX]$/.test(nic)) {
            year = 1900 + parseInt(nic.substring(0, 2));
            day = parseInt(nic.substring(2, 5));
        } else if (/^\d{12}$/.test(nic)) {
            year = parseInt(nic.substring(0, 4));
            day = parseInt(nic.substring(4, 7));
        } else {
            return;
        }

        if (day > 500) day -= 500;
        const dob = new Date(year, 0);
        dob.setDate(day);
        setForm(prev => ({ ...prev, dob: dob.toISOString().slice(0, 10) }));
    };

    const handleNext = () => {
        if (currentStep === 0) {
            const errors = validateForm();
            if (Object.keys(errors).length > 0) {
                setFormErrors(errors);
                return;
            }
        }
        setCurrentStep(prev => prev + 1);
    };

    const handleSubmit = () => {
        const fullAddress = `${form.streetNo}, ${form.streetLine}, ${form.city}`;
        const allPhones = [form.phone, ...(form.phoneNumbers || [])];

        const payload = {
            ...form,
            fullAddress,
            allPhones,
        };

        setLoading(true);
        axios.post('http://localhost:8000/api/onboard', payload)
            .then(() => {
                showToast('Employee onboarded successfully!');
                handleClear();
                setCurrentStep(0);
            })
            .catch(() => showToast('Onboarding failed!', 'error'))
            .finally(() => setLoading(false));
    };

    const handleClear = () => {
        setForm({
            firstName: '', lastName: '', department: '', role: '', employmentType: '',
            startDate: '', reportingManager: '', job_id: '', nic: '', dob: '',
            email: '', phone: '',
            phoneNumbers: [],
            streetNo: '',
            streetLine: '',
            city: '',
            district: '',
            province: '',
            usernameOrEmail: '',
            password: '',
            confirmPassword: ''
        });
        setFormErrors({});
    };

    const showToast = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const initials = `${form.firstName?.[0] || ''}${form.lastName?.[0] || ''}`.toUpperCase();

    return (
        <>
        <AdminNav />
            <Box maxWidth="900px" mx={3} my={10} marginLeft={48} marginTop={15}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Stack spacing={2} alignItems="center" mb={3}>
                        <Avatar sx={{ bgcolor: '#941936', width: 64, height: 64 }}>{initials || '?'}</Avatar>
                        <Typography variant="h5">Onboard New Employee</Typography>
                    </Stack>

                    <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 4 }}>
                        {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
                    </Stepper>

                    {currentStep === 0 && (
                        <>
                            <Typography variant="h6" gutterBottom>Basic Information</Typography>
                            <Divider sx={{ mb: 3 }} />
                            <BasicInfo
                                form={form} formErrors={formErrors} handleChange={handleChange}
                                roles={roles} jobs={jobs} managers={managers}
                                managerQuery={managerQuery} setManagerQuery={setManagerQuery}
                                setForm={setForm} handleNICExtract={handleNICExtract}
                            />
                        </>
                    )}

                    {currentStep === 1 && (
                        <>
                            <Typography variant="h6" gutterBottom>Contact Information</Typography>
                            <Divider sx={{ mb: 3 }} />
                            <ContactInfo
                                form={form}
                                setForm={setForm}
                                handleChange={handleChange}
                                formErrors={formErrors}
                            />
                        </>
                    )}

                    {currentStep === 2 && (
                        <>
                            <Typography variant="h6" gutterBottom>User Credentials</Typography>
                            <Divider sx={{ mb: 3 }} />
                            <UserInfo form={form} setForm={setForm} />
                        </>
                    )}

                    <Box mt={4} display="flex" justifyContent="space-between">
                        <Button onClick={() => setCurrentStep(prev => prev - 1)} disabled={currentStep === 0}>
                            ← Previous
                        </Button>
                        {currentStep === steps.length - 1 ? (
                            <Button
                                variant="contained"
                                sx={{ bgcolor: '#AE152D', color: '#fff', '&:hover': { bgcolor: '#7F2F44' } }}
                                onClick={handleSubmit}
                                disabled={loading}
                                startIcon={loading && <CircularProgress size={20} />}
                            >
                                {loading ? 'Submitting...' : 'Submit →'}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                sx={{ bgcolor: '#AE152D', color: '#fff', '&:hover': { bgcolor: '#7F2F44' } }}
                                onClick={handleNext}
                            >
                                Next →
                            </Button>
                        )}
                    </Box>
                </Paper>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
                </Snackbar>
            </Box>
        </>
    );
};

export default Onboard;
