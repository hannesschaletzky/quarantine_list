// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "@/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { body, method } = req;
  let respBody = {};
  const db = getDB();

  if (method === "POST") {
    body = JSON.parse(body);
    respBody = await db.put(body);
    res.statusCode = 201;
  } else if (method === "GET") {
    const { items: items } = await db.fetch();
    respBody = items;
    res.statusCode = 200;
  }
  res.json(respBody);
}
