/**
 * 環境変数設定
 * 
 * 以下の環境変数を設定可能:
 * - PORT: サーバーポート番号 (デフォルト: 3001)
 * - JWT_SECRET: JWT署名用の秘密鍵 (本番環境では必須設定)
 * - JWT_EXPIRES_IN: JWTトークンの有効期限 (デフォルト: 1h)
 * - DB_PATH: SQLiteデータベースファイルのパス (デフォルト: data/auth.db、process.cwd()からの相対パス)
 * - NODE_ENV: 実行環境 (development/production, デフォルト: development)
 * 
 * 設定方法:
 * - コマンドライン: JWT_SECRET=my-key npm run dev
 * - システム環境変数: export JWT_SECRET=my-key
 * - .envファイル: dotenvを使用する場合（現在は未使用）
 */
export const config = {
    PORT: process.env.PORT || '3001',
    JWT_SECRET: process.env.JWT_SECRET || 'default-secret-for-dev-only',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
    DB_PATH: process.env.DB_PATH || 'data/auth.db',
    NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// 本番環境では環境変数から明示的に設定されている必要がある
if (config.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be explicitly set in production environment');
}