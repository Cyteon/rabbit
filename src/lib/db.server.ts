import { DB_URL } from "$env/static/private";
import mongodb, { Db } from "mongodb";
var MongoClient = mongodb.MongoClient;

const client = new MongoClient(DB_URL);

let db: any;

export async function connectToDatabase() {
  if (db) return db;

  try {
    await client.connect();

    db = client.db("rabbit");
    return db;
  } catch (error) {
    console.error("Failed to connect to the database", error);
    throw error;
  }
}

export function getDb() {
  if (!db) {
    throw new Error("Database not connected");
  }
  return db;
}
