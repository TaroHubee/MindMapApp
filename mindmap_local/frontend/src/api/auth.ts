import { client } from './client';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await client.post('/auth/register', data);
    return response.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await client.post('/auth/login', data);
    return response.data;
};