// Jest setup file
import { closeDb } from '../db/init';
import { config } from '../config/env';
import fs from 'fs';
import path from 'path';

beforeAll(() => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Tests must run with NODE_ENV=test');
  }
});

afterAll(async () => {
  closeDb();
  await new Promise(resolve => setTimeout(resolve, 500));
  const testDbPath = path.resolve(config.DB_PATH);
  const walFiles = [testDbPath, `${testDbPath}-wal`, `${testDbPath}-shm`];
  for (const filePath of walFiles) {
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        // locked, ignore
      }
    }
  }
});
