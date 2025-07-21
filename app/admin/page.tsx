"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminPanel() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="p-6 text-center">Loading...</p>;
  }

  const user = session?.user as { email?: string; role?: string };

  if (!session || user.role !== "admin") {
    return <p className="p-6 text-center text-red-600">Access Denied</p>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6 mt-10 space-y-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-700">
        Welcome, <strong>{user.email}</strong>. You have administrative access.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/admin/audit-logs"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-center"
        >
          View Audit Logs
        </Link>
        <Link
          href="/admin/users"
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition text-center"
        >
          Manage Users
        </Link>
      </div>
    </main>
  );
}
