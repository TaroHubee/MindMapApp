import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { config } from '../config/env';

// 絶対パスならそのまま、相対パスならprocess.cwd()から解決
const DB_PATH = path.isAbsolute(config.DB_PATH)
    ? config.DB_PATH
    : path.resolve(process.cwd(), config.DB_PATH);

let dbInstance: Database.Database | null = null;

export function initDatabase() {
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
    const db = getDb();

    try {
        // テーブルの存在を確認
        const tableExists = db.prepare(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
        ).get();

        db.exec(`
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            display_name TEXT,
            avatar_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)`
        );

        if (tableExists) {
            console.log('Database verified at', DB_PATH);
        } else {
            console.log('Database initialized (tables created) at', DB_PATH);
        }
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}


export function getDb(): Database.Database {
    if (!dbInstance) {
        dbInstance = new Database(DB_PATH);
        dbInstance.pragma('journal_mode = WAL');
    }
    return dbInstance;
}

export function closeDb() {
    if (dbInstance) {
        dbInstance.close();
        dbInstance = null;
        console.log('Database connection closed');
    }
}
