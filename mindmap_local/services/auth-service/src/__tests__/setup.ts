// Jest setup file
import { closeDb } from '../db/init';
import { config } from '../config/env';
import fs from 'fs';
import path from 'path';

beforeAll(() => {
  // テスト環境のセットアップ（NODE_ENVはjest.config.jsで設定済み）
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Tests must run with NODE_ENV=test');
  }
});

afterAll(async () => {
  // データベース接続をクリーンアップ
  closeDb();
  
  // Windowsでファイルロックが解除されるまで待つ
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // テストデータベースファイルを削除
  const testDbPath = path.resolve(config.DB_PATH);
  if (fs.existsSync(testDbPath)) {
    try {
      fs.unlinkSync(testDbPath);
    } catch (error) {
      // ファイルがまだロックされている場合は次回テスト時に上書きされるので無視
      // console.warn('Test database cleanup skipped (file locked)');
    }
  }
});

beforeEach(() => {
  // 各テスト前にテーブルをクリア
});

afterEach(() => {
  // 各テスト後のクリーンアップ
});
