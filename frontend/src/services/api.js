import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
};

// Zerodha APIs
export const zerodhaAPI = {
    connect: (data) => api.post('/zerodha/connect', data),
    getConnections: () => api.get('/zerodha/connections'),
    deleteConnection: (id) => api.delete(`/zerodha/connection/${id}`),
    getAccountInfo: () => api.get('/zerodha/account-info'),
    reconnect: (id) => api.post(`/zerodha/reconnect/${id}`),
    exitAllPositions: () => api.post('/zerodha/exit-all-positions'),
};

// Orders APIs
export const ordersAPI = {
    getOrders: () => api.get('/orders'),
};

export default api;
