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

export default function DashboardPage() {
  const { data: session, status } = useSession();

  const user = session?.user as { email?: string; role?: string };

  if (status === "loading") {
    return (
      <p className="p-6 text-center text-muted-foreground">
        Loading your dashboard...
      </p>
    );
  }

  if (!session) {
    return (
      <p className="p-6 text-center text-destructive font-medium">
        Access denied.
      </p>
    );
  }

  return (
    <main className="max-w-5xl mx-auto mt-10 px-4 space-y-10">
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Your Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-foreground space-y-1">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.role || "user"}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            Use the options below to access your account settings and admin tools (if applicable).
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              variant="secondary"
              className="cursor-not-allowed opacity-60"
              disabled
              title="Profile editing is temporarily disabled"
            >
              Edit Profile (Disabled)
            </Button>

            <Button asChild>
              <Link href="/reset">Reset Password</Link>
            </Button>

            {user.role === "admin" && (
              <Button asChild variant="secondary">
                <Link href="/admin">Admin Dashboard</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Projects Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition">
            <CardHeader>
              <CardTitle className="text-lg">Template</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>A sandbox environment to design and build small apps.</p>
              <Button asChild variant="link" className="p-0 h-auto text-sm">
                <Link href="/template">Open Template</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition">
            <CardHeader>
              <CardTitle className="text-lg">Blog</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>Your personal blog for publishing articles and updates.</p>
              <Button asChild variant="link" className="p-0 h-auto text-sm">
                <Link href="/blog">Open Blog</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition">
            <CardHeader>
              <CardTitle className="text-lg">Research</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>A collection of academic and technical research articles.</p>
              <Button asChild variant="link" className="p-0 h-auto text-sm">
                <Link href="/research">Open Research</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition opacity-60">
            <CardHeader>
              <CardTitle className="text-lg">More Coming Soon</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Placeholder for future applications and tools.
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
