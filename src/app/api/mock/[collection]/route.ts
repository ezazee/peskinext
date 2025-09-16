// src/app/api/mock/[collection]/route.ts
import { NextResponse } from "next/server";
import * as raw from "../../../../data";

export const dynamic = "force-dynamic";

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

type CollectionMap = Record<string, ReadonlyArray<unknown>>;

const db: CollectionMap = Object.fromEntries(
  Object.entries(raw).filter(([, v]) => Array.isArray(v))
) as CollectionMap;

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

// Ambil nama koleksi dari URL (tanpa pakai argumen ke-2 untuk hindari error tipe Next)
export function GET(req: Request) {
  const url = new URL(req.url);
  // path: /api/mock/<collection>
  const parts = url.pathname.split("/").filter(Boolean);
  const collection = decodeURIComponent(parts[parts.length - 1] ?? "");

  const rows = db[collection];
  if (!rows) {
    return NextResponse.json(
      {
        error: `Collection '${collection}' tidak ditemukan`,
        available: Object.keys(db),
      },
      { status: 404, headers: CORS }
    );
  }

  // Query opsional: ?q=keyword (filter sederhana)
  const q = (url.searchParams.get("q") || "").toLowerCase().trim();
  const data = q
    ? rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q))
    : rows;

  return NextResponse.json(
    { count: data.length, items: data },
    { headers: CORS }
  );
}
