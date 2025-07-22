// File: app/users/[username]/page.tsx

import type { Metadata } from "next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

// ✅ Route Handler
export default async function UserProfile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <main className="max-w-xl mx-auto mt-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-foreground">
          <p className="text-base">
            <strong>Username:</strong> {username}
          </p>
          <p className="text-sm text-muted-foreground">
            Welcome to the profile of <strong>{username}</strong>.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

// ✅ Metadata (Next.js 15 style)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `User | ${username}`,
    description: `Profile page for ${username}`,
  };
}
