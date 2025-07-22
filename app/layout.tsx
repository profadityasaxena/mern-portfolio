import "./globals.css";
import type { ReactNode } from "react";
import SessionLayout from "../components/SessionLayout";
import NavBar from "../components/NavBar";
import { Analytics } from "@vercel/analytics/next"


export const metadata = {
  title: "MERN Full-Stack App",
  description: "A production-grade web application using Next.js 15",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 pt-20">
        <SessionLayout>
          <NavBar />
          <main className="p-6">{children}</main>
        </SessionLayout>
        <Analytics />
      </body>
    </html>
  );
}
