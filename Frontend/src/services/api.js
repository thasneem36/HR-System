import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/authSlice';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Attach token from Redux store on every request
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap standard API envelope { success, data, message } → response.data = payload
api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:          (data) => api.post('/login', data),
  logout:         ()     => api.post('/logout'),
  me:             ()     => api.get('/user'),
  changePassword: (data) => api.post('/change-password', data),
};

// ─── Employees ───────────────────────────────────────────────────────────────
export const employeeAPI = {
  getAll:       (params) => api.get('/employees', { params }),
  getById:      (id)     => api.get(`/employees/${id}`),
  create:       (data)   => api.post('/employees', data),
  update:       (id, data) => api.put(`/employees/${id}`, data),
  delete:       (id)     => api.delete(`/employees/${id}`),
  getHistory:   (id)     => api.get(`/employees/${id}/history`),
  getContacts:  (id)     => api.get(`/employees/${id}/contacts`),
  getLeaveBalance: (id)  => api.get(`/employees/${id}/leave-balance`),
};

// ─── Attendance ───────────────────────────────────────────────────────────────
export const attendanceAPI = {
  getAll:        (params) => api.get('/attendances', { params }),
  getById:       (id)     => api.get(`/attendances/${id}`),
  create:        (data)   => api.post('/attendances', data),
  update:        (id, data) => api.put(`/attendances/${id}`, data),
  delete:        (id)     => api.delete(`/attendances/${id}`),
  checkIn:       (data)   => api.post('/attendances/check-in', data),
  checkOut:      (data)   => api.post('/attendances/check-out', data),
  monthlyReport: (params) => api.get('/attendances/monthly-report', { params }),
};

// ─── Leaves ──────────────────────────────────────────────────────────────────
export const leaveAPI = {
  getAll:   (params) => api.get('/leaves', { params }),
  getById:  (id)     => api.get(`/leaves/${id}`),
  create:   (data)   => api.post('/leaves', data),
  update:   (id, data) => api.put(`/leaves/${id}`, data),
  delete:   (id)     => api.delete(`/leaves/${id}`),
  approve:  (id, data) => api.post(`/leaves/${id}/approve`, data),
  reject:   (id, data) => api.post(`/leaves/${id}/reject`, data),
  pending:  ()       => api.get('/leaves/pending'),
  approved: ()       => api.get('/leaves/approved'),
  rejected: ()       => api.get('/leaves/rejected'),
};

// ─── Departments ──────────────────────────────────────────────────────────────
export const departmentAPI = {
  getAll:       ()       => api.get('/departments'),
  getById:      (id)     => api.get(`/departments/${id}`),
  create:       (data)   => api.post('/departments', data),
  update:       (id, data) => api.put(`/departments/${id}`, data),
  delete:       (id)     => api.delete(`/departments/${id}`),
  getEmployees: (id)     => api.get(`/departments/${id}/employees`),
};

// ─── Jobs ────────────────────────────────────────────────────────────────────
export const jobAPI = {
  getAll:       (params) => api.get('/jobs', { params }),
  getById:      (id)     => api.get(`/jobs/${id}`),
  create:       (data)   => api.post('/jobs', data),
  update:       (id, data) => api.put(`/jobs/${id}`, data),
  delete:       (id)     => api.delete(`/jobs/${id}`),
  getEmployees: (id)     => api.get(`/jobs/${id}/employees`),
};

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const dashboardAPI = {
  stats:            () => api.get('/dashboard/stats'),
  attendanceSummary:() => api.get('/dashboard/attendance-summary'),
  leaveSummary:     () => api.get('/dashboard/leave-summary'),
  employeeSummary:  () => api.get('/dashboard/employee-summary'),
};

// ─── Lookups (for form dropdowns) ────────────────────────────────────────────
export const lookupAPI = {
  employeeTypes: () => api.get('/lookup/employee-types'),
  userRoles:     () => api.get('/lookup/user-roles'),
  leaveTypes:    () => api.get('/lookup/leave-types'),
  departments:   () => api.get('/lookup/departments'),
  jobs:          () => api.get('/lookup/jobs'),
};

// ─── Leave Types (Settings) ──────────────────────────────────────────────────
export const leaveTypeAPI = {
  getAll:  ()           => api.get('/leave-types'),
  create:  (data)       => api.post('/leave-types', data),
  update:  (id, data)   => api.put(`/leave-types/${id}`, data),
  delete:  (id)         => api.delete(`/leave-types/${id}`),
};

// ─── Reports ─────────────────────────────────────────────────────────────────
export const reportAPI = {
  attendance: (params) => api.get('/attendances/monthly-report', { params }),
  leave:      (params) => api.get('/leaves/report', { params }),
};

// ─── Holidays ────────────────────────────────────────────────────────────────
export const holidayAPI = {
  getAll:    ()       => api.get('/holidays'),
  getById:   (id)     => api.get(`/holidays/${id}`),
  create:    (data)   => api.post('/holidays', data),
  update:    (id, data) => api.put(`/holidays/${id}`, data),
  delete:    (id)     => api.delete(`/holidays/${id}`),
  upcoming:  ()       => api.get('/holidays/upcoming'),
};

// ─── Payroll ─────────────────────────────────────────────────────────────────
export const payrollAPI = {
  getAll:       (params)    => api.get('/payroll', { params }),
  getById:      (id)        => api.get(`/payroll/${id}`),
  create:       (data)      => api.post('/payroll', data),
  update:       (id, data)  => api.put(`/payroll/${id}`, data),
  delete:       (id)        => api.delete(`/payroll/${id}`),
  approve:      (id)        => api.post(`/payroll/${id}/approve`),
  markPaid:     (id)        => api.post(`/payroll/${id}/paid`),
  generate:     (data)      => api.post('/payroll/generate', data),
  summary:      (params)    => api.get('/payroll/summary', { params }),
  myPayslips:   ()          => api.get('/payroll/my-payslips'),
};

// ─── Notifications ───────────────────────────────────────────────────────────
export const notificationAPI = {
  getAll:      ()      => api.get('/notifications'),
  unreadCount: ()      => api.get('/notifications/unread-count'),
  send:        (data)  => api.post('/notifications', data),
  markRead:    (id)    => api.patch(`/notifications/${id}/read`),
  markAllRead: ()      => api.patch('/notifications/read-all'),
  delete:      (id)    => api.delete(`/notifications/${id}`),
};

// ─── Documents ───────────────────────────────────────────────────────────────
export const documentAPI = {
  list:      (employeeId, params) => api.get(`/employees/${employeeId}/documents`, { params }),
  getAll:    (employeeId, params) => api.get(`/employees/${employeeId}/documents`, { params }),
  upload:    (employeeId, data, onProgress) => api.post(`/employees/${employeeId}/documents`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress ? (e) => onProgress(Math.round((e.loaded * 100) / e.total)) : undefined,
  }),
  download:  (docId)              => api.get(`/documents/${docId}/download`, { responseType: 'blob' }),
  update:    (docId, data)        => api.put(`/documents/${docId}`, data),
  delete:    (docId)              => api.delete(`/documents/${docId}`),
  sendExpiryAlerts: (params)      => api.post('/documents/expiry-alerts', {}, { params }),
};

// ─── Audit Log ───────────────────────────────────────────────────────────────
export const auditAPI = {
  getAll: (params) => api.get('/audit-logs', { params }),
};

export default api;
