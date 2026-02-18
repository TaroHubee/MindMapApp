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
  
  // テストデータベースファイルを削除（WALモードの関連ファイルも含む）
  const testDbPath = path.resolve(config.DB_PATH);
  const walFiles = [testDbPath, `${testDbPath}-wal`, `${testDbPath}-shm`];
  
  for (const filePath of walFiles) {
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        // ファイルがまだロックされている場合は次回テスト時に上書きされるので無視
        // console.warn(`Test database cleanup skipped (${path.basename(filePath)} locked)`);
      }
    }
  }
});
