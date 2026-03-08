import { config } from './config/env';
import { createApp } from './app';

const app = createApp();

const server = app.listen(config.PORT, () => {
    console.log(`[startup] API Gateway started`);
    console.log(`[startup] Environment: ${config.NODE_ENV}`);
    console.log(`[startup] Listening on port: ${config.PORT}`);
    console.log(`[startup] Proxy routes: /auth -> ${config.AUTH_SERVICE_URL}`);
    console.log(`[startup] Health check: ${config.API_GATEWAY_URL}/health`);
});

const shutdown = (signal: string) => {
    console.log(`[shutdown] Received ${signal}. Closing server...`);
    server.close(() => {
        console.log('[shutdown] Server closed');
        process.exit(0);
    });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));