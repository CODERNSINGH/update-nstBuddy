import axios from 'axios';

const API_BASE_URL = 'https://update-nstbuddy.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable credentials for session cookies
    timeout: 45000, // 45 seconds timeout for Render cold starts
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Questions API
export const questionsApi = {
    getAll: async (params?: { semester?: number; subject?: string; topic?: string; search?: string }) => {
        const response = await api.get('/questions', { params });
        return response.data;
    },

    getFilters: async (semester?: number) => {
        const response = await api.get('/questions/filters', { params: { semester } });
        return response.data;
    },

    create: async (data: {
        questionName: string;
        subject: string;
        topic: string;
        link: string;
        semester?: number;
    }) => {
        const response = await api.post('/questions', data);
        return response.data;
    },

    update: async (id: string, data: {
        questionName: string;
        subject: string;
        topic: string;
        link: string;
        semester?: number;
    }) => {
        const response = await api.put(`/questions/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/questions/${id}`);
        return response.data;
    },
};

// Notices API
export const noticesApi = {
    getActive: async () => {
        const response = await api.get('/notices');
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/notices/all');
        return response.data;
    },

    create: async (data: {
        title: string;
        content: string;
        priority?: string;
        expiresAt?: string;
    }) => {
        const response = await api.post('/notices', data);
        return response.data;
    },

    update: async (id: string, data: {
        title: string;
        content: string;
        priority?: string;
        isActive?: boolean;
        expiresAt?: string;
    }) => {
        const response = await api.put(`/notices/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/notices/${id}`);
        return response.data;
    },
};

// Auth API
export const authApi = {
    login: async (email: string, uniqueKey: string) => {
        const response = await api.post('/auth/login', { email, uniqueKey });
        return response.data;
    },

    verify: async (token: string) => {
        const response = await api.post('/auth/verify', { token });
        return response.data;
    },

    setupAdmin: async (email: string, uniqueKey: string, name: string) => {
        const response = await api.post('/auth/setup-admin', { email, uniqueKey, name });
        return response.data;
    },

    getAdmins: async () => {
        const response = await api.get('/auth/admins');
        return response.data;
    },
};

export default api;
