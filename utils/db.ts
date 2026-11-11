// SQLite statt Deta Base. Bietet dieselben drei Aufrufe (put, fetch, delete),
// damit die API-Routen unverändert bleiben. Jedes Item liegt als JSON in "data".
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const DB_PATH = process.env.DB_PATH ?? "./data/quarantine.db";

let db: DatabaseSync | undefined;

const open = () => {
  if (!db) {
    mkdirSync(dirname(DB_PATH), { recursive: true });
    db = new DatabaseSync(DB_PATH);
    db.exec(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS items (
        key    TEXT PRIMARY KEY,
        listId TEXT NOT NULL,
        data   TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS items_listId ON items (listId);
    `);
  }
  return db;
};

type Row = { key?: string; listId?: string; [field: string]: unknown };

export const getDB = () => {
  const conn = open();
  return {
    // Wie Deta: ohne key wird einer erzeugt, mit key wird das Item ersetzt
    put: async (item: Row) => {
      const stored = { ...item, key: item.key ?? randomUUID() };
      conn
        .prepare("INSERT OR REPLACE INTO items (key, listId, data) VALUES (?, ?, ?)")
        .run(stored.key, String(stored.listId ?? ""), JSON.stringify(stored));
      return stored;
    },
    fetch: async (query: { listId: unknown }) => {
      const rows = conn
        .prepare("SELECT data FROM items WHERE listId = ?")
        .all(String(query.listId ?? "")) as { data: string }[];
      return { items: rows.map((r) => JSON.parse(r.data) as Row) };
    },
    delete: async (key: unknown) => {
      conn.prepare("DELETE FROM items WHERE key = ?").run(String(key));
      return null;
    },
  };
};
