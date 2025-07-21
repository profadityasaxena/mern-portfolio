import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Cache the client in globalThis to prevent hot-reload reconnections
declare global {
  // Allow global variable reuse
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

if (process.env.NODE_ENV === "development") {
  // In development, use global to preserve value across module reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, don't use global (Next.js runs cold starts)
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
