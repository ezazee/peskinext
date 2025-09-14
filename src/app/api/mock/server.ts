// src/app/api/mock/server.ts
import jsonServer from 'json-server';
import * as raw from '../../../data'; // naik 3x ke src/, lalu ke data

type DbCollections = Record<string, ReadonlyArray<unknown>>;

const db: DbCollections = {};
const rawRecord: Record<string, unknown> = raw as Record<string, unknown>;
for (const [key, value] of Object.entries(rawRecord)) {
  if (Array.isArray(value)) db[key] = value as ReadonlyArray<unknown>;
}

const server = jsonServer.create();
const router = jsonServer.router(db as object);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(router);

const port = Number(process.env.PORT ?? 3001);
server.listen(port, () => {
  console.log(`JSON Server running at http://localhost:${port} → [${Object.keys(db).join(', ')}]`);
});
