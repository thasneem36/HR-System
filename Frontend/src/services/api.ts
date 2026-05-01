import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const auth = {
    login: (credentials: { email: string; password: string }) =>
        api.post('/login', credentials),
    logout: () => api.post('/logout'),
    getUser: () => api.get('/user'),
};

export const dashboard = {
    getStats: () => api.get('/dashboard/stats'),
    getAttendanceSummary: () => api.get('/dashboard/attendance-summary'),
    getLeaveSummary: () => api.get('/dashboard/leave-summary'),
};

export const employees = {
    getAll: () => api.get('/employees'),
    getOne: (id: number) => api.get(`/employees/${id}`),
    create: (data: any) => api.post('/employees', data),
    update: (id: number, data: any) => api.put(`/employees/${id}`, data),
    delete: (id: number) => api.delete(`/employees/${id}`),
    getHistory: (id: number) => api.get(`/employees/${id}/history`),
    getContacts: (id: number) => api.get(`/employees/${id}/contacts`),
    getLeaveBalance: (id: number) => api.get(`/employees/${id}/leave-balance`),
};

export const departments = {
    getAll: () => api.get('/departments'),
    getOne: (id: number) => api.get(`/departments/${id}`),
    create: (data: any) => api.post('/departments', data),
    update: (id: number, data: any) => api.put(`/departments/${id}`, data),
    delete: (id: number) => api.delete(`/departments/${id}`),
};

export const jobs = {
    getAll: () => api.get('/jobs'),
    getOne: (id: number) => api.get(`/jobs/${id}`),
    create: (data: any) => api.post('/jobs', data),
    update: (id: number, data: any) => api.put(`/jobs/${id}`, data),
    delete: (id: number) => api.delete(`/jobs/${id}`),
};

export const leaves = {
    getAll: () => api.get('/leaves'),
    getOne: (id: number) => api.get(`/leaves/${id}`),
    create: (data: any) => api.post('/leaves', data),
    update: (id: number, data: any) => api.put(`/leaves/${id}`, data),
    delete: (id: number) => api.delete(`/leaves/${id}`),
    approve: (id: number) => api.post(`/leaves/${id}/approve`),
    reject: (id: number) => api.post(`/leaves/${id}/reject`),
    getTypes: () => api.get('/leave-types'),
    getStatuses: () => api.get('/leave-statuses'),
};

export const attendance = {
    getAll: () => api.get('/attendance'),
    getOne: (id: number) => api.get(`/attendance/${id}`),
    create: (data: any) => api.post('/attendance', data),
    update: (id: number, data: any) => api.put(`/attendance/${id}`, data),
    delete: (id: number) => api.delete(`/attendance/${id}`),
    checkIn: () => api.post('/attendance/check-in'),
    checkOut: () => api.post('/attendance/check-out'),
    getSummary: () => api.get('/attendance/summary'),
};

export const holidays = {
    getAll: () => api.get('/holidays'),
    getOne: (id: number) => api.get(`/holidays/${id}`),
    create: (data: any) => api.post('/holidays', data),
    update: (id: number, data: any) => api.put(`/holidays/${id}`, data),
    delete: (id: number) => api.delete(`/holidays/${id}`),
};

export default api; 