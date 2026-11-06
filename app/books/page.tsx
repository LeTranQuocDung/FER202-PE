"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useBooks } from "@/context/books-context";
import { BookForm } from "@/components/book-form";
import { BookList } from "@/components/book-list";
import { BookFilters, BookSummary } from "@/components/book-filters-summary";

export default function BooksPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { loading: booksLoading } = useBooks();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  // While we don't know yet (or are redirecting) show nothing from this page.
  if (loading || !user) return null;

  return (
    <div data-testid="books-page" className="space-y-6">
      <h1 className="text-2xl font-bold">My books</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <BookForm />
          <BookSummary />
        </div>
        <div className="min-w-0 space-y-4 lg:col-span-2">
          <BookFilters />
          {booksLoading ? (
            <p className="text-sm text-muted-foreground">Loading your books…</p>
          ) : (
            <BookList />
          )}
        </div>
      </div>
    </div>
  );
}
