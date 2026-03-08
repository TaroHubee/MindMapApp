import './setup';
import { initDatabase, getDb } from '../db/init';

describe('Database', () => {
    it('should initialize database and create tables', () => {
        initDatabase();
        const db = getDb();
        const tables = db.prepare(
            "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
        ).all();
        const tableNames = (tables as any[]).map((t: { name: string }) => t.name);
        expect(tableNames).toContain('mindmaps');
        expect(tableNames).toContain('nodes');
        expect(tableNames).toContain('edges');
    })
});
