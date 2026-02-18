import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import authRoutes from './routes/auth';
import pkg from '../package.json';

export function createApp() {
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

  return app;
}
