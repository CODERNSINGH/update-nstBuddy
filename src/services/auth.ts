import axios from 'axios';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

// Configure axios to send credentials (cookies) with requests
axios.defaults.withCredentials = true;

export const authAPI = {
    // Get current authenticated user
    getCurrentUser: async () => {
        const response = await axios.get(`${API_URL}/auth/current-user`);
        return response.data;
    },

    // Logout user
    logout: async () => {
        const response = await axios.post(`${API_URL}/auth/logout`);
        return response.data;
    },

    // Get Google OAuth URL
    getGoogleAuthUrl: () => {
        return `${API_URL}/auth/google`;
    }
};

export const userAPI = {
    // Get all users (admin only)
    getUsers: async () => {
        const response = await axios.get(`${API_URL}/auth/users`);
        return response.data;
    },

    // Update user Pro status (admin only)
    updateProStatus: async (userId: string, isPro: boolean) => {
        const response = await axios.patch(`${API_URL}/auth/users/${userId}/pro`, { isPro });
        return response.data;
    },

    // Update user Admin status (admin only)
    updateAdminStatus: async (userId: string, isAdmin: boolean) => {
        const response = await axios.patch(`${API_URL}/auth/users/${userId}/admin`, { isAdmin });
        return response.data;
    }
};

