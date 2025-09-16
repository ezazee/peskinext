// src/app/api/mock/route.ts
import { NextResponse } from "next/server";
import * as raw from "../../../data";

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

export function GET() {
  const collections = Object.keys(db).sort();
  return NextResponse.json({ collections }, { headers: CORS });
}
