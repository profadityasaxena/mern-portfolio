"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const blogPosts = [
  {
    slug: "ai-vs-human-creativity",
    title: "AI vs Human Creativity: Who Wins?",
    excerpt:
      "Explore how artificial intelligence is reshaping creative industries and challenging human imagination.",
    image: "/blog/images/placeholder1.jpg",
  },
  {
    slug: "future-of-web",
    title: "The Future of Web Development",
    excerpt:
      "From WebAssembly to edge functions, what’s next in modern frontend stacks?",
    image: "/blog/images/placeholder2.jpg",
  },
  {
    slug: "nextjs-15-explained",
    title: "Next.js 15: Everything You Should Know",
    excerpt:
      "A breakdown of server actions, the app router, and new architectural patterns introduced in Next.js 15.",
    image: "/blog/images/placeholder3.jpg",
  },
  {
    slug: "design-systems",
    title: "Design Systems for Scalable Frontends",
    excerpt:
      "Learn how to build consistent, maintainable UIs using design systems and component libraries like ShadCN.",
    image: "/blog/images/placeholder4.jpg",
  },
];

export default function BlogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 🔐 Redirect unauthenticated users to login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <p className="p-6 text-center text-muted-foreground">
        Checking authentication...
      </p>
    );
  }

  if (!session) return null;

  return (
    <main className="max-w-6xl mx-auto mt-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Latest Articles</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Card key={post.slug} className="hover:shadow-md transition">
            <div className="relative w-full h-48 overflow-hidden rounded-t">
              <Image
                src={post.image}
                alt={`Cover for ${post.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg leading-tight line-clamp-2">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
