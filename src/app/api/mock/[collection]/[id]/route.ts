import { NextResponse } from 'next/server';
import * as raw from '../../../../../data';

export const dynamic = 'force-dynamic';

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

type CollectionMap = Record<string, ReadonlyArray<unknown>>;
const db: CollectionMap = Object.fromEntries(
  Object.entries(raw).filter(([, v]) => Array.isArray(v))
) as CollectionMap;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function pickId(it: unknown): string | undefined {
  if (!isRecord(it)) return undefined;
  const prefer: ReadonlyArray<string> = ['id', '_id', 'uuid', 'slug', 'code'];
  for (const k of prefer) {
    const v = it[k];
    if (typeof v === 'string' || typeof v === 'number') return String(v);
  }
  const guess = Object.keys(it).find((k) => /id$/i.test(k));
  if (!guess) return undefined;
  const val = it[guess];
  return typeof val === 'string' || typeof val === 'number' ? String(val) : undefined;
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export function GET(_req: Request, { params }: { params: { collection: string; id: string } }) {
  const { collection, id } = params;
  const rows = db[collection];
  if (!rows) {
    return NextResponse.json(
      { error: `Collection '${collection}' not found`, available: Object.keys(db) },
      { status: 404, headers: CORS }
    );
  }
  const item = rows.find((x) => pickId(x) === id);
  if (!item) {
    return NextResponse.json(
      { error: `Item '${id}' not found in '${collection}'` },
      { status: 404, headers: CORS }
    );
  }
  return NextResponse.json(item, { headers: CORS });
}
