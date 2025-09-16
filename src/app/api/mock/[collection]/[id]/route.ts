// src/app/api/mock/[collection]/[id]/route.ts
import { NextResponse } from "next/server";
import * as raw from "../../../../../data";

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

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function pickId(it: unknown): string | undefined {
  if (!isRecord(it)) return undefined;
  const prefer: ReadonlyArray<string> = ["id", "_id", "uuid", "slug", "code"];
  for (const k of prefer) {
    const v = it[k];
    if (typeof v === "string" || typeof v === "number") return String(v);
  }
  const guess = Object.keys(it).find((k) => /id$/i.test(k));
  if (!guess) return undefined;
  const val = it[guess];
  return typeof val === "string" || typeof val === "number"
    ? String(val)
    : undefined;
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

// Ambil params dari URL agar tidak kena validasi tipe Next untuk argumen ke-2
export function GET(req: Request) {
  const url = new URL(req.url);
  // path: /api/mock/<collection>/<id>
  const parts = url.pathname.split("/").filter(Boolean);
  const id = decodeURIComponent(parts[parts.length - 1] ?? "");
  const collection = decodeURIComponent(parts[parts.length - 2] ?? "");

  if (!collection || !id) {
    return NextResponse.json(
      { error: "Path tidak valid. Gunakan /api/mock/<collection>/<id>" },
      { status: 400, headers: CORS }
    );
  }

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

  const item = rows.find((x) => pickId(x) === id);
  if (!item) {
    return NextResponse.json(
      { error: `Item '${id}' tidak ditemukan di '${collection}'` },
      { status: 404, headers: CORS }
    );
  }

  return NextResponse.json(item, { headers: CORS });
}
