import 'server-only';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import type { App, Category } from './data';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'apps.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS apps (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    iconGradient TEXT NOT NULL,
    accentColor TEXT NOT NULL,
    rating REAL NOT NULL DEFAULT 0,
    ratingCount INTEGER NOT NULL DEFAULT 0,
    size TEXT NOT NULL DEFAULT '< 5 MB',
    developer TEXT NOT NULL,
    developerUrl TEXT,
    isOfflineReady INTEGER NOT NULL DEFAULT 0,
    isPWA INTEGER NOT NULL DEFAULT 0,
    isNew INTEGER NOT NULL DEFAULT 1,
    isTrending INTEGER NOT NULL DEFAULT 0,
    isFeatured INTEGER NOT NULL DEFAULT 0,
    tags TEXT NOT NULL DEFAULT '[]',
    submittedBy TEXT,
    submittedAt INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS rate_limits (
    userId TEXT NOT NULL,
    submittedAt INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_rate_limits_user ON rate_limits(userId, submittedAt);
`);

type DbRow = {
  id: string; name: string; tagline: string; description: string;
  url: string; category: string; iconGradient: string; accentColor: string;
  rating: number; ratingCount: number; size: string; developer: string;
  developerUrl: string | null; isOfflineReady: number; isPWA: number;
  isNew: number; isTrending: number; isFeatured: number; tags: string;
  submittedBy: string | null; submittedAt: number;
};

function rowToApp(row: DbRow): App {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    url: row.url,
    category: row.category as Category,
    iconGradient: JSON.parse(row.iconGradient) as [string, string],
    accentColor: row.accentColor,
    rating: row.rating,
    ratingCount: row.ratingCount,
    size: row.size,
    developer: row.developer,
    developerUrl: row.developerUrl ?? undefined,
    isOfflineReady: row.isOfflineReady === 1,
    isPWA: row.isPWA === 1,
    isNew: row.isNew === 1,
    isTrending: row.isTrending === 1,
    isFeatured: row.isFeatured === 1,
    tags: JSON.parse(row.tags),
  };
}

export function getAllApps(): App[] {
  const rows = db.prepare('SELECT * FROM apps ORDER BY submittedAt DESC').all() as DbRow[];
  return rows.map(rowToApp);
}

export function getAppById(id: string): App | undefined {
  const row = db.prepare('SELECT * FROM apps WHERE id = ?').get(id) as DbRow | undefined;
  return row ? rowToApp(row) : undefined;
}

export function urlExists(url: string): boolean {
  const row = db.prepare('SELECT 1 FROM apps WHERE url = ?').get(url);
  return !!row;
}

export function idExists(id: string): boolean {
  const row = db.prepare('SELECT 1 FROM apps WHERE id = ?').get(id);
  return !!row;
}

export function getRateLimitCount(userId: string, windowSeconds = 86400): number {
  const since = Math.floor(Date.now() / 1000) - windowSeconds;
  const row = db.prepare(
    'SELECT COUNT(*) as cnt FROM rate_limits WHERE userId = ? AND submittedAt > ?'
  ).get(userId, since) as { cnt: number };
  return row.cnt;
}

export function recordSubmission(userId: string): void {
  db.prepare('INSERT INTO rate_limits (userId, submittedAt) VALUES (?, ?)').run(
    userId, Math.floor(Date.now() / 1000)
  );
}

export type InsertApp = Omit<App, 'rating' | 'ratingCount' | 'isNew' | 'isTrending' | 'isFeatured'> & {
  submittedBy: string;
};

export function insertApp(app: InsertApp): void {
  db.prepare(`
    INSERT INTO apps (
      id, name, tagline, description, url, category,
      iconGradient, accentColor, size, developer, developerUrl,
      isOfflineReady, isPWA, tags, submittedBy
    ) VALUES (
      @id, @name, @tagline, @description, @url, @category,
      @iconGradient, @accentColor, @size, @developer, @developerUrl,
      @isOfflineReady, @isPWA, @tags, @submittedBy
    )
  `).run({
    ...app,
    iconGradient: JSON.stringify(app.iconGradient),
    tags: JSON.stringify(app.tags),
    isOfflineReady: app.isOfflineReady ? 1 : 0,
    isPWA: app.isPWA ? 1 : 0,
    developerUrl: app.developerUrl ?? null,
  });
}
