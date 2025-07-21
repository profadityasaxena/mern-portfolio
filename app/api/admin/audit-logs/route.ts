// File: src/app/api/admin/audit-logs/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId, Document } from "mongodb";

interface AuditLogEntry extends Document {
  _id: ObjectId;
  timestamp: Date;
  actorId: ObjectId;
  targetUserId: ObjectId;
  action: string;
  details: Record<string, unknown>;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const actionFilter = searchParams.get("action");
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<AuditLogEntry>("audit_logs");

    const query: Partial<Pick<AuditLogEntry, "action">> = {};
    if (actionFilter) query.action = actionFilter;

    const total = await collection.countDocuments(query);
    const logs = await collection
      .find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const sanitized = logs.map((log) => ({
      id: log._id.toString(),
      timestamp: log.timestamp,
      actorId: log.actorId.toString(),
      targetUserId: log.targetUserId.toString(),
      action: log.action,
      details: log.details,
    }));

    return NextResponse.json({ logs: sanitized, total }, { status: 200 });
  } catch (err) {
    console.error("Error fetching audit logs:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
