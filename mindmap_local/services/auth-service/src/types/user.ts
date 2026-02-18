export interface User {
    id: number;
    email: string;
    password_hash: string;
    display_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}