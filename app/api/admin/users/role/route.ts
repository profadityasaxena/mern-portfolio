// File: src/app/api/admin/users/role/route.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/audit";

const VALID_ROLES = ["admin", "employee", "vendor", "partner", "client"];

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin" || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId, newRole } = await req.json();

    if (!userId || !newRole) {
      return NextResponse.json({ error: "Missing userId or newRole" }, { status: 400 });
    }

    if (!VALID_ROLES.includes(newRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    const targetUser = await users.findOne({ _id: new ObjectId(userId) });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (session.user.id === userId && newRole !== "admin") {
      return NextResponse.json(
        { error: "Admins cannot demote themselves" },
        { status: 400 }
      );
    }

    if (targetUser.role === "admin" && newRole !== "admin") {
      const adminCount = await users.countDocuments({ role: "admin" });
      if (adminCount === 1) {
        return NextResponse.json(
          { error: "Cannot demote the last remaining admin" },
          { status: 400 }
        );
      }
    }

    await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role: newRole } }
    );

    // ✅ Safe usage of session.user.id
    await logAuditEvent({
      actorId: session.user.id, // Now definitely a string
      action: "UPDATE_ROLE",
      targetUserId: userId,
      details: {
        previousRole: targetUser.role,
        newRole,
      },
    });

    return NextResponse.json({ success: true, role: newRole }, { status: 200 });

  } catch (error) {
    console.error("Role update failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
