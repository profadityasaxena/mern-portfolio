import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Allowed roles during public registration only
const ALLOWED_ROLES = ["user", "vendor", "client"] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export async function POST(req: Request) {
  try {
    const body: RegisterPayload = await req.json();
    const { name, email, password, role } = body;

    // ✅ Basic required fields check
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields (name, email, password) are required." },
        { status: 400 }
      );
    }

    // ✅ Strict role validation — reject if not in whitelist
    if (role && !ALLOWED_ROLES.includes(role as AllowedRole)) {
      return NextResponse.json({ error: "Invalid role selected." }, { status: 400 });
    }

    const assignedRole: AllowedRole = (role as AllowedRole) || "user";

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    // ✅ Check if user already exists
    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already exists." }, { status: 409 });
    }

    // ✅ Hash password
    const hashedPassword = await hash(password, 12);

    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { success: true, userId: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
