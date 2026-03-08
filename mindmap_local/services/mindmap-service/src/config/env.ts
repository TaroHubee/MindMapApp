import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
    PORT: process.env.PORT || '3002',
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_PATH: process.env.DB_PATH || (process.env.NODE_ENV === 'test' ? 'data/mindmap.test.db' : 'data/mindmap.db'),
    JWT_SECRET: process.env.JWT_SECRET || 'default-secret-for-dev-only'
}