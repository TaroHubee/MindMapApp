export interface User {
    id: number;
    email: string;
    displayName: string;
    avaterUrl: String | null;
}

export interface RegisterRequest {
    email: string;
    password: string;
    displayName: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}