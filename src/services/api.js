import axios from 'axios';

// Use import.meta.env for Vite instead of process.env
const API_URL = import.meta.env.VITE_API_URL || 'https://asmita-testing-backend-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

export const projects = {
  create: (data) => api.post('/projects', data),
  getAll: () => api.get('/projects'),
  addMember: (data) => api.post('/projects/add-member', data),
  getAvailableUsers: () => api.get('/projects/available-users'),
};

export const tasks = {
  create: (data) => api.post('/tasks', data),
  getAll: (params) => api.get('/tasks', { params }),
  updateStatus: (id, status) => api.put(`/tasks/${id}/status`, { status }),
  getDashboardStats: () => api.get('/tasks/dashboard/stats'),
};

export default api;
