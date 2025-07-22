import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">About This Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-base text-foreground">
          <p>
            This application is a full-featured MERN stack platform built using
            <strong> Next.js 15</strong> and modern TypeScript. It showcases real-world
            patterns for authentication, role-based access, dynamic user profiles,
            and MongoDB-backed APIs.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Core Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-foreground">
            <li>Next.js 15 App Router with TypeScript and server actions</li>
            <li>Secure authentication via NextAuth (OAuth + credentials)</li>
            <li>Role-based access control (admin, vendor, client, etc.)</li>
            <li>Dynamic, extensible user profile system (like LinkedIn)</li>
            <li>Audit logging of user activity (login, role change, etc.)</li>
            <li>Section-based profile editor: Education, Experience, Certifications</li>
            <li>Responsive UI using Tailwind CSS</li>
            <li>
              MongoDB integration via <code className="bg-muted px-1 rounded text-sm">clientPromise</code> with dynamic routing
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Tech Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-foreground">
            <li><strong>Next.js 15</strong> (App Router)</li>
            <li><strong>MongoDB</strong> with native driver</li>
            <li><strong>NextAuth</strong> for authentication</li>
            <li><strong>TypeScript</strong> with ESLint and strict mode</li>
            <li><strong>Tailwind CSS</strong> for styling</li>
          </ul>
        </CardContent>
      </Card>

      <p className="text-muted-foreground text-base">
        This project is actively being expanded. Future releases will include
        features like 2FA, approval-based onboarding, audit trace correlation,
        and custom role/permission systems.
      </p>
    </main>
  );
}
