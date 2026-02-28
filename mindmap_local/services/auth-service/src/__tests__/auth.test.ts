import request from 'supertest';
<<<<<<< HEAD
<<<<<<< HEAD
import jwt from 'jsonwebtoken';
import ms from 'ms';
import { createApp } from '../app';
import { initDatabase, getDb } from '../db/init';
import { config } from '../config/env';

describe('Auth API', () => {
  const app = createApp();

=======
import express from 'express';
=======
>>>>>>> 7a37944 (fix: refactor app structure and improve test setup[#6])
import jwt from 'jsonwebtoken';
import ms from 'ms';
import { createApp } from '../app';
import { initDatabase, getDb } from '../db/init';
import { config } from '../config/env';

describe('Auth API', () => {
<<<<<<< HEAD
>>>>>>> 4962c58 (feat(auth-service): add authentication routes and tests)
=======
  const app = createApp();

>>>>>>> 7a37944 (fix: refactor app structure and improve test setup[#6])
  beforeAll(() => {
    // テスト用データベースを初期化
    initDatabase();
  });

  beforeEach(() => {
    // 各テスト前にusersテーブルをクリア
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
      // 最初のユーザーを登録
      await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          displayName: 'Test User'
        });

      // 同じメールアドレスで再度登録を試みる
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
      // emailなし
      let response = await request(app)
        .post('/auth/register')
        .send({
          password: 'password123',
          displayName: 'Test User'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required fields');

      // passwordなし
      response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          displayName: 'Test User'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required fields');

      // displayNameなし
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
      // 各ログインテスト前にテストユーザーを作成
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
      // emailなし
      let response = await request(app)
        .post('/auth/login')
        .send({
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required fields');

      // passwordなし
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

      // JWTトークンをデコード
      const decoded = jwt.verify(response.body.token, config.JWT_SECRET) as any;

      // ペイロードに必要なフィールドが含まれているか確認
      expect(decoded).toHaveProperty('userId');
      expect(decoded).toHaveProperty('email');
      expect(decoded.email).toBe('test@example.com');
      
      // トークンに有効期限が設定されているか確認
      expect(decoded).toHaveProperty('iat'); // issued at
      expect(decoded).toHaveProperty('exp'); // expiration
      
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 7a37944 (fix: refactor app structure and improve test setup[#6])
      // 有効期限が設定時間になっているか確認（config.JWT_EXPIRES_INから動的に計算）
      const expectedExpiryMs = ms(config.JWT_EXPIRES_IN);
      const expectedExpirySeconds = Math.floor(expectedExpiryMs / 1000);
      const actualExpirySeconds = decoded.exp - decoded.iat;
      expect(actualExpirySeconds).toBe(expectedExpirySeconds);
<<<<<<< HEAD
=======
      // 有効期限が設定時間（1時間 = 3600秒）になっているか確認
      const expiresInSeconds = decoded.exp - decoded.iat;
      expect(expiresInSeconds).toBe(3600); // 1h = 3600 seconds
>>>>>>> 4962c58 (feat(auth-service): add authentication routes and tests)
=======
>>>>>>> 7a37944 (fix: refactor app structure and improve test setup[#6])
    });
  });
});
