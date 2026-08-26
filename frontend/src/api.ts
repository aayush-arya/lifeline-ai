import axios from 'axios';
import { User, Patient, Vital, Hospital, Appointment } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

let authToken: string | null = null;

/** Sets (or clears, with null) the bearer token attached to every request. */
export function setAuthToken(token: string | null) {
  authToken = token;
}

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

export const authAPI = {
  register: (data: { name: string; email: string; phone: string; password: string; userType: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
  loginAsGuest: () =>
    api.post<AuthResponse>('/auth/guest'),
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
  getNearby: (lat: number, lng: number) =>
    api.get<{ success: boolean; source: string; hospitals: Hospital[] }>('/hospitals/nearby', { params: { lat, lng } }),
  getById: (id: string) => api.get<{ success: boolean; hospital: Hospital }>(`/hospitals/${id}`),
  create: (data: Partial<Hospital>) =>
    api.post<{ success: boolean; hospital: Hospital }>('/hospitals', data),
};

export const userAPI = {
  update: (id: string, data: { name?: string; email?: string }) =>
    api.put<{ success: boolean; user: User }>(`/users/${id}`, data),
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
