import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Configure axios to send credentials (cookies) with requests
axios.defaults.withCredentials = true;

export const authAPI = {
    // Verify Firebase ID token with backend
    verifyToken: async (idToken: string) => {
        const response = await axios.post(`${API_URL}/auth/verify-token`, { idToken });
        return response.data;
    },

    // Logout user
    logout: async () => {
        const response = await axios.post(`${API_URL}/auth/logout`);
        return response.data;
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
