import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  const { email } = await req.json();

  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection("users").findOne({ email });

  // Always return a generic message to avoid email enumeration
  if (!user) {
    return NextResponse.json({
      message: "If this email exists, a reset link has been sent.",
    });
  }

  // Generate a secure random token
  const token = randomBytes(32).toString("hex");

  // Token expires in 1 hour
  const expires = new Date(Date.now() + 1000 * 60 * 60);

  await db.collection("password_resets").insertOne({
    userId: user._id,
    token,
    expires,
  });

  // Simulate sending an email (replace with actual email logic)
  console.log(`Send email with link: http://localhost:3000/reset/${token}`);

  return NextResponse.json({
    message: "If this email exists, a reset link has been sent.",
  });
}
