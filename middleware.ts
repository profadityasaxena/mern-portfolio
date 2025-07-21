// File: src/middleware.ts

import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // Allow access only to users with role 'admin'
      return token?.role === "admin";
    },
  },
  pages: {
    signIn: "/login", // Redirect unauthorized users to login
  },
});

// Apply this middleware only to /admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
