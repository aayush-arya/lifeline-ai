import axios from 'axios';
import { User, Patient, Vital, Hospital, Appointment } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const authAPI = {
  register: (data: { name: string; email: string; phone: string; password: string; userType: string }) =>
    api.post('/auth/register', data),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  loginAsGuest: () =>
    api.post('/auth/guest'),
};

export const patientAPI = {
  getAll: () => api.get<{ success: boolean; patients: Patient[] }>('/patients'),
  getById: (id: string) => api.get<{ success: boolean; patient: Patient }>(`/patients/${id}`),
  create: (data: Partial<Patient>) => api.post<{ success: boolean; patient: Patient }>('/patients', data),
  update: (id: string, data: Partial<Patient>) =>
    api.put<{ success: boolean; patient: Patient }>(`/patients/${id}`, data),
};

export const vitalAPI = {
  getByUserId: (userId: string) =>
    api.get<{ success: boolean; vitals: Vital[] }>(`/vitals/${userId}`),
  create: (data: Partial<Vital>) =>
    api.post<{ success: boolean; vital: Vital }>('/vitals', data),
};

export const hospitalAPI = {
  getAll: () => api.get<{ success: boolean; hospitals: Hospital[] }>('/hospitals'),
  getById: (id: string) => api.get<{ success: boolean; hospital: Hospital }>(`/hospitals/${id}`),
  create: (data: Partial<Hospital>) =>
    api.post<{ success: boolean; hospital: Hospital }>('/hospitals', data),
};

export const appointmentAPI = {
  getByUserId: (userId: string) =>
    api.get<{ success: boolean; appointments: Appointment[] }>(`/appointments/${userId}`),
  create: (data: Partial<Appointment>) =>
    api.post<{ success: boolean; appointment: Appointment }>('/appointments', data),
};

export const dashboardAPI = {
  getDashboard: (userId: string) =>
    api.get('/dashboard/' + userId),
};

export default api;
