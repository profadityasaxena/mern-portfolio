"use client";

import Link from "next/link";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <nav className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </nav>
      <UserMenu />
    </header>
  );
}
