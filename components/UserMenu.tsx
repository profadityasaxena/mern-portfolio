"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function UserMenu() {
  const { data: session } = useSession();

  return session ? (
    <div className="flex items-center gap-2">
      <p className="text-sm">Welcome, {session.user?.email}</p>
      <button onClick={() => signOut()} className="text-blue-600 underline">
        Sign out
      </button>
    </div>
  ) : (
    <button onClick={() => signIn()} className="text-blue-600 underline">
      Sign in
    </button>
  );
}
