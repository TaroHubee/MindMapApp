import { config } from './config/env';
import { initDatabase, closeDb } from './db/init';
import { createApp } from './app';
import pkg from '../package.json';

try {
initDatabase();
console.log('[startup] Database initialized');
} catch (error) {
console.error('[startup] Database initialization failed:', error);
process.exit(1);
}

const app = createApp();

const server = app.listen(config.PORT, () => {
console.log('[startup] Auth service started');
console.log(`[startup] Environment: ${config.NODE_ENV}`);
console.log(`[startup] Listening on port: ${config.PORT}`);
console.log('[startup] Base routes: /auth');
console.log(`[startup] Health check: http://localhost:${config.PORT}/health`);
console.log(`[startup] Version: ${pkg.version ?? '0.0.0'}`);
});

const shutdown = (signal: string) => {
console.log(`[shutdown] Received ${signal}. Closing server...`);
server.close(() => {
closeDb();
console.log('[shutdown] Server closed');
process.exit(0);
});
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
