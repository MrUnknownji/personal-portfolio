import { MongoClient } from "mongodb";

const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "portfolio";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

export function getMongoClient() {
  const uri = process.env.MONGO_DB_URI;

  if (!uri) {
    throw new Error("MONGO_DB_URI is not configured.");
  }

  if (!globalForMongo.mongoClientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
    });

    globalForMongo.mongoClientPromise = client.connect();
  }

  return globalForMongo.mongoClientPromise;
}

export async function getPortfolioDb() {
  const client = await getMongoClient();
  return client.db(MONGO_DB_NAME);
}
