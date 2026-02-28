import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { config } from "../config/env";

export const client = axios.create({
    baseURL: config.apiBaseUrl,
    headers: {
        'content-Type': 'application/json',
    },
});

client.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);
