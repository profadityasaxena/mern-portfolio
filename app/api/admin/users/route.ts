// File: src/app/api/admin/users/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Reused config
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // Only allow admins
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const client = await clientPromise;
        const db = client.db();

        const users = await db
            .collection("users")
            .find({}, { projection: { password: 0 } }) // Exclude password
            .toArray();

        // Convert _id to string and rename to id
        const sanitizedUsers = users.map(({ _id, ...rest }) => ({
            id: _id.toString(),
            ...rest,
        }));

        return NextResponse.json({ users: sanitizedUsers }, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
