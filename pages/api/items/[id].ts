// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "@/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = getDB();
  let {
    body,
    method,
    query: { id },
  } = req;
  let respBody = {};

  if (method === "PUT") {
    // todo
  } else if (method === "DELETE") {
    respBody = await db.delete(id);
    res.statusCode = 200;
  }
  res.json(respBody);
}
