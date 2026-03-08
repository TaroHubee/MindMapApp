import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { config } from '../config/env';


const DB_PATH = path.isAbsolute(config.DB_PATH) ? config.DB_PATH : path.resolve(process.cwd(), config.DB_PATH);

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
    if (!dbInstance) {
        dbInstance = new Database(DB_PATH);
        dbInstance.pragma('journal_mode = WAL');
    }
    return dbInstance;
}

export function closeDb(): void {
    if (dbInstance) {
        dbInstance.close();
        dbInstance = null;
    }
}

export function initDatabase(): void {
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    const db = getDb();

    db.exec(`
        CREATE TABLE IF NOT EXISTS mindmaps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            user_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    db.exec(`
        CREATE TABLE IF NOT EXISTS nodes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mindmap_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            label TEXT,
            position_x REAL NOT NULL,
            position_y REAL NOT NULL,
            data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (mindmap_id) REFERENCES mindmaps(id) ON DELETE CASCADE
        )
    `);

    db.exec(`
        CREATE TABLE IF NOT EXISTS edges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mindmap_id INTEGER NOT NULL,
            source_node_id INTEGER NOT NULL,
            target_node_id INTEGER NOT NULL,
            type TEXT,
            label TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (mindmap_id) REFERENCES mindmaps(id) ON DELETE CASCADE,
            FOREIGN KEY (source_node_id) REFERENCES nodes(id) ON DELETE CASCADE,
            FOREIGN KEY (target_node_id) REFERENCES nodes(id) ON DELETE CASCADE    
        )    
    `);

    console.log('Database initialized successfully');
}