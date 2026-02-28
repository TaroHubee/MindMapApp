<<<<<<< HEAD
import { config } from './config/env';
import { initDatabase, closeDb } from './db/init';
import { createApp } from './app';
import pkg from '../package.json';

=======
import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { initDatabase, closeDb } from './db/init';
import authRoutes from './routes/auth';
import pkg from '../package.json';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/health', (_req, res) => {
	res.status(200).json({
		status: 'ok',
		service: 'auth-service',
		version: pkg.version ?? '0.0.0',
		uptime: Math.round(process.uptime()),
		timestamp: new Date().toISOString(),
		env: config.NODE_ENV,
	});
});

>>>>>>> 4962c58 (feat(auth-service): add authentication routes and tests)
try {
	initDatabase();
	console.log('[startup] Database initialized');
} catch (error) {
	console.error('[startup] Database initialization failed:', error);
	process.exit(1);
}

<<<<<<< HEAD
const app = createApp();

=======
>>>>>>> 4962c58 (feat(auth-service): add authentication routes and tests)
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
