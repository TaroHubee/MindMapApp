import request from 'supertest';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import { createApp } from '../app';
import { initDatabase, getDb } from '../db/init';
import { config } from '../config/env';

describe('Auth API', () => {
  const app = createApp();

  beforeAll(() => {
    initDatabase();
  });

  beforeEach(() => {
    const db = getDb();
    db.prepare('DELETE FROM users').run();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          displayName: 'Test User'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('test@example.com');
      expect(response.body.displayName).toBe('Test User');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 409 error when email already exists', async () => {
      await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          displayName: 'Test User'
        });

      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'different123',
          displayName: 'Another User'
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Email already exists');
    });

    it('should validate required fields', async () => {
      let response = await request(app)
        .post('/auth/register')
        .send({
          password: 'password123',
          displayName: 'Test User'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required fields');

      response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          displayName: 'Test User'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required fields');

      response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required fields');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          displayName: 'Test User'
        });
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.displayName).toBe('Test User');
      expect(response.body.user).not.toHaveProperty('password_hash');
    });

    it('should return 401 error with invalid email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should return error with invalid password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should validate required fields', async () => {
      let response = await request(app)
        .post('/auth/login')
        .send({
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required fields');

      response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required fields');
    });

    it('should return JWT token with correct payload', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');

      const decoded = jwt.verify(response.body.token, config.JWT_SECRET) as any;

      expect(decoded).toHaveProperty('userId');
      expect(decoded).toHaveProperty('email');
      expect(decoded.email).toBe('test@example.com');
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');

      const expectedExpiryMs = ms(config.JWT_EXPIRES_IN);
      const expectedExpirySeconds = Math.floor(expectedExpiryMs / 1000);
      const actualExpirySeconds = decoded.exp - decoded.iat;
      expect(actualExpirySeconds).toBe(expectedExpirySeconds);
    });
  });
});
