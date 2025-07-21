// File: app/users/[username]/page.tsx
import type { Metadata } from "next";

// ✅ Use `Promise<{ username: string }>` for Next.js 15+
export default async function UserProfile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <main className="p-6">
      <h1>User Profile: {username}</h1>
      <p>Welcome to the profile of {username}.</p>
    </main>
  );
}

// ✅ Consistent usage for generateMetadata as well
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
