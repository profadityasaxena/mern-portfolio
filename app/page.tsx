import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center space-y-6 bg-white text-black">
      <Image src="/logo.png" alt="Logo" width={200} height={100} />

      <h1 className="text-3xl font-bold">Welcome to the MERN Full-Stack App</h1>

      <p className="text-black max-w-xl">
        This platform demonstrates a full-stack MERN application using Next.js 15, MongoDB,
        NextAuth, and modern TypeScript. It includes authentication, role-based access,
        and an extensible user profile system similar to LinkedIn.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        <div className="border border-black rounded-lg p-4 bg-white shadow-sm text-left text-black">
          <h2 className="text-lg font-semibold mb-2">Admin Credentials</h2>
          <p><strong>Username:</strong> <code className="bg-white text-black px-1 rounded">admin@admin.com</code></p>
          <p><strong>Password:</strong> <code className="bg-white text-black px-1 rounded">password</code></p>
        </div>

        <div className="border border-black rounded-lg p-4 bg-white shadow-sm text-left text-black">
          <h2 className="text-lg font-semibold mb-2">User Credentials</h2>
          <p><strong>Username:</strong> <code className="bg-white text-black px-1 rounded">user@user.com</code></p>
          <p><strong>Password:</strong> <code className="bg-white text-black px-1 rounded">password</code></p>
        </div>
      </div>
    </main>
  );
}
