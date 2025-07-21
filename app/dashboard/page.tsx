"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="p-6">Loading your dashboard...</p>;
  }

  if (!session) {
    return <p className="p-6 text-red-600">Access denied.</p>;
  }

  const user = session.user as { email?: string; role?: string };

  return (
    <main className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow space-y-6">
      <h1 className="text-2xl font-semibold">Welcome to Your Dashboard</h1>

      <div className="text-gray-700 space-y-1">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role || "user"}</p>
      </div>

      <p className="text-sm text-gray-500">
        Use the options below to access your account settings and admin tools (if applicable).
      </p>

      <div className="flex flex-wrap gap-4 mt-4">
        {/* Disabled Profile Link */}
        <span
          className="bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-not-allowed"
          title="Profile editing is temporarily disabled"
        >
          Edit Profile (Disabled)
        </span>

        {/* Reset Password */}
        <Link
          href="/reset"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Reset Password
        </Link>

        {/* Admin Dashboard */}
        {user.role === "admin" && (
          <Link
            href="/admin"
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
          >
            Admin Dashboard
          </Link>
        )}
      </div>
    </main>
  );
}
