// src/app/api/mock/server.ts

export const dynamic = 'force-dynamic';

export function GET() {
  return new Response(
    'Endpoint ini tidak aktif. Gunakan /api/mock, /api/mock/:collection, atau /api/mock/:collection/:id.',
    { status: 404 }
  );
}

export function OPTIONS() {
  return new Response(null, { status: 204 });
}
