import { MongoClient, type Db, type Document } from "mongodb";

const uri = process.env.MONGODB_URI;

let client: MongoClient | null = null;

declare const globalThis: {
  __crescentMongo?: Promise<MongoClient>;
} & typeof global;

function connect(): Promise<MongoClient> {
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!client) {
    client = new MongoClient(uri);
  }
  return client.connect();
}

export function getMongoClient(): Promise<MongoClient> {
  if (!globalThis.__crescentMongo) {
    globalThis.__crescentMongo = connect().catch((err) => {
      globalThis.__crescentMongo = undefined;
      throw err;
    });
  }
  return globalThis.__crescentMongo;
}

export async function getDB(): Promise<Db> {
  const c = await getMongoClient();
  // Optional override so the same cluster can host several apps safely
  return c.db(process.env.MONGODB_DB || undefined);
}

export async function getCollection<T extends Document>(name: string) {
  const db = await getDB();
  return db.collection<T>(name);
}
