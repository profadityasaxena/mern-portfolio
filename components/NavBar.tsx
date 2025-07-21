"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-gray-100 shadow-sm border-b">
      <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left Nav with Logo */}
        <div className="flex items-center gap-8">
          {/* Logo space */}
          <div className="w-10 h-10 bg-gray-300 rounded flex items-center justify-center mr-4">
            {/* Replace with your logo */}
            <span className="text-black font-bold text-lg">Logo</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-black">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <Link href="/about" className="hover:text-blue-600 transition">About</Link>
            {session && (
              <Link href="/dashboard" className="hover:text-blue-600 transition">
                Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Right Auth Controls */}
        <div className="flex items-center gap-4 text-sm">
          {status === "loading" ? (
            <span className="text-gray-500">Loading...</span>
          ) : session ? (
            <>
              <span className="text-black truncate max-w-[150px]">
                {session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="border border-blue-600 text-blue-600 px-4 py-1.5 rounded hover:bg-blue-50 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
