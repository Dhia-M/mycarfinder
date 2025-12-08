import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data } = await axios.post(
                    `${API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                localStorage.setItem('accessToken', data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

// Auth API
export const authAPI = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
};

// Vehicle API
export const vehicleAPI = {
    getAll: (params?: any) => api.get('/vehicles', { params }),
    getById: (id: string) => api.get(`/vehicles/${id}`),
    create: (data: any) => api.post('/vehicles', data),
    update: (id: string, data: any) => api.put(`/vehicles/${id}`, data),
    delete: (id: string) => api.delete(`/vehicles/${id}`),
    uploadImages: (files: File[]) => {
        const formData = new FormData();
        files.forEach((file) => formData.append('images', file));
        return api.post('/vehicles/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    getMyVehicles: () => api.get('/vehicles/my/vehicles'),
};

// Timeline API
export const timelineAPI = {
    create: (vehicleId: string, data: any) =>
        api.post(`/vehicles/${vehicleId}/timeline`, data),
    update: (vehicleId: string, eventId: string, data: any) =>
        api.put(`/vehicles/${vehicleId}/timeline/${eventId}`, data),
    delete: (vehicleId: string, eventId: string) =>
        api.delete(`/vehicles/${vehicleId}/timeline/${eventId}`),
    uploadImage: (vehicleId: string, file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        return api.post(`/vehicles/${vehicleId}/timeline/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

// User API
export const userAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data: any) => api.put('/users/profile', data),
    getUserVehicles: (userId: string) => api.get(`/users/${userId}/vehicles`),
};

// Admin API
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getAllVehicles: (params?: any) => api.get('/admin/vehicles', { params }),
    deleteVehicle: (id: string) => api.delete(`/admin/vehicles/${id}`),
    getAllUsers: (params?: any) => api.get('/admin/users', { params }),
    getUserById: (id: string) => api.get(`/admin/users/${id}`),
    deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
    updateUserRole: (id: string, role: string) =>
        api.post(`/admin/users/${id}/role`, { role }),
};

// Message API
export const messageAPI = {
    send: (data: any) => api.post('/messages', data),
    getConversations: () => api.get('/messages/conversations'),
    getMessages: (otherUserId: string, vehicleId?: string) =>
        api.get('/messages', { params: { otherUserId, vehicleId } }),
    markAsRead: (messageIds: string[]) => api.put('/messages/read', { messageIds }),
    getUnreadCount: () => api.get('/messages/unread-count'),
};
