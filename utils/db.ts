// SQLite statt Deta Base. Bietet dieselben Aufrufe wie Deta (put, fetch, delete) plus get und count
// für die Grenzen in der API. Jedes Item liegt als JSON in "data".
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const DB_PATH = process.env.DB_PATH ?? "./data/quarantine.db";

// Harte Obergrenze für die Datei, damit niemand per Skript die Platte des Servers füllt.
// 12800 Seiten à 4 KiB = 50 MiB. Ist sie erreicht, schlägt jeder Schreibversuch mit SQLITE_FULL fehl.
const MAX_PAGES = Number(process.env.DB_MAX_PAGES) || 12800;

let db: DatabaseSync | undefined;

const open = () => {
  if (!db) {
    mkdirSync(dirname(DB_PATH), { recursive: true });
    db = new DatabaseSync(DB_PATH);
    db.exec(`
      PRAGMA page_size = 4096;
      PRAGMA journal_mode = WAL;
      PRAGMA journal_size_limit = 4194304;
      PRAGMA max_page_count = ${MAX_PAGES};
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

export const isDiskFull = (err: unknown) =>
  err instanceof Error && /SQLITE_FULL|database or disk is full/i.test(err.message);

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
    get: async (key: string) => {
      const row = conn.prepare("SELECT data FROM items WHERE key = ?").get(key) as
        | { data: string }
        | undefined;
      return row ? (JSON.parse(row.data) as Row) : undefined;
    },
    count: async (listId: string) => {
      const row = conn
        .prepare("SELECT COUNT(*) AS n FROM items WHERE listId = ?")
        .get(listId) as { n: number };
      return row.n;
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
