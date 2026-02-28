import { create } from "zustand";
import type { User } from '../types/auth';

interface AuthStore {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    token: localStorage.getItem('authToken'),
    isLoading: false,
    error: null,
    setUser: (user) => set({user}),
    setToken: (token) => {
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
        set({ token });
    },
    setLoading: (isLoading) => set ({ isLoading }),
    setError: (error) => set({ error }),
    logout: () => {
        localStorage.removeItem('authToken');
        set({ user: null, token: null });
    },
}));