import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { BooksProvider } from "@/context/books-context";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "ShelfLife",
  description: "Keep track of the books you want to read, are reading or have finished.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <AuthProvider>
          <BooksProvider>
            <Header />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-10">
              {children}
            </main>
          </BooksProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
