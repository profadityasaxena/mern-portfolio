"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const ALLOWED_ROLES = ["user", "vendor", "client"] as const;
type Role = (typeof ALLOWED_ROLES)[number];

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!ALLOWED_ROLES.includes(form.role)) {
      setError("Invalid role selected.");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        router.push("/login");
      }
    } catch {
      setError("Network error during registration.");
    }
  };

  if (status === "loading") {
    return (
      <main className="p-6 text-center text-muted-foreground">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto mt-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />

            <Select
              value={form.role}
              onValueChange={(value) =>
                setForm({ ...form, role: value as Role })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ALLOWED_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}

            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>

          <div className="text-right mt-2">
            <Link
              href="/reset"
              className="text-sm text-muted-foreground hover:text-primary underline"
            >
              Forgot password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
