"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function NavBar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-background text-foreground border-b shadow z-50 mb-5">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo + Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-foreground text-background rounded flex items-center justify-center font-bold text-lg">
              Logo
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-primary transition">Home</Link>
            <Link href="/about" className="hover:text-primary transition">About</Link>
            {session && (
              <Link href="/dashboard" className="hover:text-primary transition">
                Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Right: Auth Controls */}
        <div className="flex items-center gap-4 text-sm">
          {status === "loading" ? (
            <span className="opacity-60">Loading...</span>
          ) : session ? (
            <>
              <span className="truncate max-w-[150px]">{session.user?.email}</span>
              <Button
                variant="default"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button size="sm" variant="default">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" variant="outline">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Burger: Mobile Trigger */}
        <div className="md:hidden ml-4">
          <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="md:hidden w-48">
              <DropdownMenuItem asChild>
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
              </DropdownMenuItem>
              {session && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
