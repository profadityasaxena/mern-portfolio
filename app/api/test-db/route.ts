import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Handle GET request to /api/test-db
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collections = await db.listCollections().toArray();

    return NextResponse.json({ collections });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }
}
