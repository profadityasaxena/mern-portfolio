"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 🔐 Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <p className="p-6 text-center text-muted-foreground">Checking authentication...</p>
    );
  }

  if (!session) {
    return null; // avoid flicker while redirecting
  }

  return (
    <main className="max-w-md mx-auto mt-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Protected Page</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          You are logged in as{" "}
          <span className="font-medium text-foreground">{session.user?.email}</span>.
        </CardContent>
      </Card>
    </main>
  );
}
