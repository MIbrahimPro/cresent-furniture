import { MongoClient, ObjectId, type Db, type Document } from "mongodb";

export { ObjectId };

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
  // "crescent" by default so a shared cluster URI never collides with
  // another app's database; MONGODB_DB overrides when needed.
  return c.db(process.env.MONGODB_DB || "crescent");
}

export async function getCollection<T extends Document>(name: string) {
  const db = await getDB();
  return db.collection<T>(name);
}
