import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

interface MongoCache {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
}

declare global {
  var _mongoCache: MongoCache | undefined;
}

const cached: MongoCache = global._mongoCache ?? { client: null, promise: null };
if (!global._mongoCache) {
  global._mongoCache = cached;
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cached.client) {
    return { client: cached.client, db: cached.client.db() };
  }

  if (!cached.promise) {
    cached.promise = MongoClient.connect(MONGODB_URI);
  }

  cached.client = await cached.promise;
  return { client: cached.client, db: cached.client.db() };
}
