"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export function Header() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
          <BookOpen className="size-5" aria-hidden />
          ShelfLife
        </Link>

        {!loading && (
          <nav className="flex min-w-0 flex-wrap items-center gap-2">
            {user ? (
              <>
                <span data-testid="user-email" className="max-w-[10rem] truncate text-sm text-muted-foreground sm:max-w-xs">
                  {user.email}
                </span>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/books" data-testid="link-books">
                    My books
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  data-testid="btn-logout"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login" data-testid="btn-login">
                    Login
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register" data-testid="btn-register">
                    Register
                  </Link>
                </Button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
