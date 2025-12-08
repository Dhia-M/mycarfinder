import { create } from 'zustand';
import { authAPI } from '@/lib/api';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    login: async (email: string, password: string) => {
        try {
            const { data } = await authAPI.login({ email, password });
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            set({ user: data.user, isAuthenticated: true });
        } catch (error) {
            throw error;
        }
    },

    register: async (userData: any) => {
        try {
            const { data } = await authAPI.register(userData);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            set({ user: data.user, isAuthenticated: true });
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            set({ user: null, isAuthenticated: false });
        }
    },

    checkAuth: async () => {
        const token = localStorage.getItem('accessToken');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
            set({ isLoading: false, isAuthenticated: false });
            return;
        }

        try {
            const { data } = await authAPI.getMe();
            set({ user: data, isAuthenticated: true, isLoading: false });
        } catch (error) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },

    setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
    },
}));
