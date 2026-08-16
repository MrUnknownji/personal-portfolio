import { MongoClient } from "mongodb";

const uri = process.env.MONGO_DB_URI;
const databaseName = process.env.MONGO_DB_NAME || "portfolio";

if (!uri) {
  throw new Error("MONGO_DB_URI is required to create database indexes.");
}

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
});

try {
  await client.connect();
  const database = client.db(databaseName);

  await Promise.all([
    database.collection("contact_messages").createIndex({ createdAt: -1 }),
    database.collection("contact_messages").createIndex({ email: 1 }),
    database
      .collection("contact_messages")
      .createIndex({ deleteAt: 1 }, { expireAfterSeconds: 0 }),
    database
      .collection("request_rate_limits")
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]);

  console.log(`Database indexes are ready in ${databaseName}.`);
} finally {
  await client.close();
}
