// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getDB, isDiskFull } from "@/utils/db";

// Ein Eintrag hat rund 150 Byte, größere Anfragen lehnt Next mit 413 ab
export const config = { api: { bodyParser: { sizeLimit: "1kb" } } };

const MAX_ITEMS_PER_LIST = 200;
const MAX_NAME_LENGTH = 200;
const LIST_ID = /^[A-Za-z0-9]{1,32}$/;

type ItemInput = {
  key?: string;
  name: string;
  inCart: boolean;
  createdAt: string;
  listId: string;
};

// Nimmt nur die Felder, die die App wirklich sendet. Alles andere wird nicht gespeichert.
const parseItem = (raw: unknown): ItemInput | undefined => {
  let data: unknown;
  try {
    data = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return undefined;
  }
  if (typeof data !== "object" || data === null) return undefined;
  const { key, name, inCart, createdAt, listId } = data as Record<string, unknown>;

  if (typeof name !== "string" || name.length === 0 || name.length > MAX_NAME_LENGTH) return undefined;
  if (typeof inCart !== "boolean") return undefined;
  if (typeof createdAt !== "string" || createdAt.length > 40 || isNaN(Date.parse(createdAt))) return undefined;
  if (typeof listId !== "string" || !LIST_ID.test(listId)) return undefined;
  if (key !== undefined && (typeof key !== "string" || key.length > 64)) return undefined;

  return { ...(key !== undefined && { key }), name, inCart, createdAt, listId };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method } = req;
  let respBody: unknown = {};
  const db = getDB();

  try {
    if (method === "POST") {
      const item = parseItem(body);
      if (!item) return res.status(400).json({ error: "invalid item" });
      if ((await db.count(item.listId)) >= MAX_ITEMS_PER_LIST) {
        return res.status(429).json({ error: "list is full" });
      }
      delete item.key; // neue Einträge bekommen immer einen frischen key
      respBody = await db.put(item);
      res.statusCode = 201;
    } else if (method === "GET") {
      const { items: items } = await db.fetch({ listId: req.query.id });
      respBody = items;
      res.statusCode = 200;
    } else if (method === "PUT") {
      const item = parseItem(body);
      if (!item?.key) return res.status(400).json({ error: "invalid item" });
      // Nur bestehende Einträge ändern, Liste und Erstellzeit bleiben wie gespeichert
      const existing = await db.get(item.key);
      if (!existing) return res.status(404).json({ error: "not found" });
      respBody = await db.put({ ...item, listId: existing.listId, createdAt: existing.createdAt });
      res.statusCode = 200;
    }
  } catch (err) {
    if (isDiskFull(err)) return res.status(507).json({ error: "storage full" });
    throw err;
  }
  res.json(respBody);
}
