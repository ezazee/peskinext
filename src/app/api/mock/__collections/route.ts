import { NextResponse } from 'next/server';
import * as raw from '../../../../data';

export const dynamic = 'force-dynamic';

type CollectionMap = Record<string, ReadonlyArray<unknown>>;
const db: CollectionMap = Object.fromEntries(
  Object.entries(raw).filter(([, v]) => Array.isArray(v))
) as CollectionMap;

export function GET() {
  const names = Object.keys(db);
  const counts = Object.fromEntries(names.map((k) => [k, db[k].length]));
  return NextResponse.json({ collections: names, counts });
}
