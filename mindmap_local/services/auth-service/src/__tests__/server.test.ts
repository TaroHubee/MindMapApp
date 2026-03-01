import request from 'supertest';
import { createApp } from '../app';
import { initDatabase } from '../db/init';
import pkg from '../../package.json';

describe('Server Health Check', () => {
  const app = createApp();

  beforeAll(() => {
    initDatabase();
  });

  describe('GET /health', () => {
    it('should return 200 status code', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
    });

    it('should return correct health check structure', async () => {
      const response = await request(app).get('/health');

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('service');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('env');
    });

    it('should return correct values in health check', async () => {
      const response = await request(app).get('/health');

      expect(response.body.status).toBe('ok');
      expect(response.body.service).toBe('auth-service');
      expect(response.body.version).toBe(pkg.version);
      expect(response.body.env).toBe('test');
      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.uptime).toBeGreaterThan(0);
    });

    it('should return valid ISO timestamp', async () => {
      const response = await request(app).get('/health');

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toString()).not.toBe('Invalid Date');
      expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });
});
