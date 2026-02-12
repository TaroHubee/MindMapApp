import Database from 'better-sqlite3';
import { config } from '../config/env';

const DB_PATH = config.DB_PATH;

export function initDatabase() {
    const db = new Database(DB_PATH);

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

    console.log('Database initialized at', DB_PATH);
    db.close();
}

export function getDb() {
    return new Database(DB_PATH);
}
