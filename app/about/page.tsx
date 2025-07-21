export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-6 bg-white text-black">
      <h1 className="text-3xl font-bold">About This Project</h1>

      <p className="text-lg">
        This application is a full-featured MERN stack platform built using
        <strong> Next.js 15</strong> and modern TypeScript. It showcases real-world
        patterns for authentication, role-based access, dynamic user profiles,
        and MongoDB-backed APIs.
      </p>

      <h2 className="text-xl font-semibold mt-8">Core Features</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>Next.js 15 App Router with TypeScript and server actions</li>
        <li>Secure authentication via NextAuth (OAuth + credentials)</li>
        <li>Role-based access control (admin, vendor, client, etc.)</li>
        <li>Dynamic, extensible user profile system (like LinkedIn)</li>
        <li>Audit logging of user activity (login, role change, etc.)</li>
        <li>Section-based profile editor: Education, Experience, Certifications</li>
        <li>Responsive UI using Tailwind CSS</li>
        <li>MongoDB integration via <code>clientPromise</code> with dynamic routing</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8">Tech Stack</h2>
      <ul className="list-inside list-disc">
        <li><strong>Next.js 15</strong> (App Router)</li>
        <li><strong>MongoDB</strong> with native driver</li>
        <li><strong>NextAuth</strong> for authentication</li>
        <li><strong>TypeScript</strong> with ESLint and strict mode</li>
        <li><strong>Tailwind CSS</strong> for styling</li>
      </ul>

      <p className="mt-6">
        This project is actively being expanded. Future releases will include
        features like 2FA, approval-based onboarding, audit trace correlation,
        and custom role/permission systems.
      </p>
    </main>
  );
}
