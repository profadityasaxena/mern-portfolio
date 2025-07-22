"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminPanel() {
  const { data: session, status } = useSession();

  const user = session?.user as { email?: string; role?: string };

  if (status === "loading") {
    return <p className="p-6 text-center text-muted-foreground">Loading...</p>;
  }

  if (!session || user.role !== "admin") {
    return (
      <p className="p-6 text-center text-destructive font-medium">
        Access Denied
      </p>
    );
  }

  return (
    <main className="max-w-3xl mx-auto mt-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            Welcome, <strong>{user.email}</strong>. You have administrative access.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="default" className="w-full sm:w-auto">
              <Link href="/admin/audit-logs">View Audit Logs</Link>
            </Button>
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link href="/admin/users">Manage Users</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
