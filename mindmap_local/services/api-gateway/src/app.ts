import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from './config/env';
import pkg from '../package.json';

export function createApp() {
    const app = express();

    app.use(cors({
        origin: config.FRONTEND_URL,
        credentials: true,
    }));

    //app.use(express.json());

    app.get('/health', (_req, res) => {
        res.status(200).json({
            status: 'ok',
            service: 'API Gateway',
            uptime: Math.round(process.uptime()),
            timestamp: new Date().toISOString(),
            version: pkg.version,
        });
    });

    app.use('/auth', createProxyMiddleware({
        target: config.AUTH_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { '^/': '/auth/' },
        on: {
            proxyReq: (_proxyReq, req) => {
                console.log(`[Proxy] ${req.method} ${req.url} -> ${config.AUTH_SERVICE_URL}${req.url}`); 
            },
            proxyRes: (proxyRes, req) => {
                console.log(`[Proxy] ${req.method} ${req.url} <- ${proxyRes.statusCode}`);
            },
            error: (err, req, res) => {
                console.error(`[Proxy Error] ${req.method} ${req.url}:`, err.message);
                if ('writeHead' in res && !res.headersSent) {
                    res.writeHead(503, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        error: 'Service Unavailable',
                        message: 'Auth service is currently unavailable'
                    }))
                }
            }
        }
        
    }));

    return app;
}