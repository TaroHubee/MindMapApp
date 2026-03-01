import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenv.config();

let version = '1.0.0';
try {
    const packageJson = JSON.parse(
        readFileSync(join(__dirname, '../../package.json'), 'utf-8')
    );
    version = packageJson.version;
} catch (error) {
    console.warn('Could not read version from package.json, using default:', version);
}

const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (!value) {
        throw new Error(`Environment variable ${key} is required but not set.`);
    }
    return value;
};

export const config = {
    PORT: parseInt(process.env.PORT || '3000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',

    JWT_SECRET: getEnvVar(
        'JWT_SECRET',
        process.env.NODE_ENV === 'production' ? undefined : 'default-secret-for-dev-only'
    ),

    AUTH_SERVICE_URL: getEnvVar('AUTH_SERVICE_URL', 'http://localhost:3001'),

    FRONTEND_URL: getEnvVar('FRONTEND_URL', 'http://localhost:5173'),

    SERVICE_NAME: 'api-gateway',
    VERSION: version,
} as const;

if (config.NODE_ENV === 'production' && config.JWT_SECRET === 'default-secret-for-dev-only') {
    throw new Error('JWT_SECRET must be set in production environment');
}