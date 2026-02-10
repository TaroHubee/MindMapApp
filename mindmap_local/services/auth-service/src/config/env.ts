export const config = {
    PORT: process.env.PORT || '3001',
    JWT_SECRET: process.env.JWT_SECRET || 'default-secret-for-dev-only',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
    DB_PATH: process.env.DB_PATH || '../../data/auth.db',
    NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

if (config.NODE_ENV === 'production' && config.JWT_SECRET.includes('default')) {
    throw new Error('JWT_SECRET must be set in production environment');
}