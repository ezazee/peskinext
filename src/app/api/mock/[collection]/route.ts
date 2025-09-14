import { NextRequest, NextResponse } from 'next/server';
import * as raw from '../../../../data';

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

type SortOrder = 'asc' | 'desc';
function compare(a: unknown, b: unknown, order: SortOrder): number {
  let r = 0;
  if (typeof a === 'number' && typeof b === 'number') r = a - b;
  else if (typeof a === 'string' && typeof b === 'string') r = a.localeCompare(b);
  else if (typeof a === 'boolean' && typeof b === 'boolean') r = a === b ? 0 : a ? 1 : -1;
  else if (a == null && b == null) r = 0;
  else if (a == null) r = -1;
  else if (b == null) r = 1;
  else r = String(a).localeCompare(String(b));
  return order === 'desc' ? -r : r;
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export function GET(req: NextRequest, { params }: { params: { collection: string } }) {
  const { collection } = params;
  const rowsSrc = db[collection];

  if (!rowsSrc) {
    return NextResponse.json(
      { error: `Collection '${collection}' not found`, available: Object.keys(db) },
      { status: 404, headers: CORS }
    );
  }

  let rows: unknown[] = Array.from(rowsSrc);
  const sp = req.nextUrl.searchParams;
  const page = Number(sp.get('_page') ?? '1');
  const limit = Number(sp.get('_limit') ?? '50');
  const q = (sp.get('q') ?? '').toLowerCase();
  const sortKey = sp.get('_sort') ?? '';
  const order = ((sp.get('_order') ?? 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc') as SortOrder;

  if (q) rows = rows.filter((x) => JSON.stringify(x).toLowerCase().includes(q));

  if (sortKey) {
    rows.sort((a, b) => {
      const va = isRecord(a) ? a[sortKey] : undefined;
      const vb = isRecord(b) ? b[sortKey] : undefined;
      return compare(va, vb, order);
    });
  }

  const start = Math.max(0, (page - 1) * limit);
  const paged = rows.slice(start, start + limit);

  return NextResponse.json(paged, {
    headers: { ...CORS, 'x-total-count': String(rows.length) },
  });
}
