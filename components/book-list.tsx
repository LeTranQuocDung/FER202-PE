"use client";

import { ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBooks } from "@/context/books-context";
import { nextStatus } from "@/lib/books";

export function BookList() {
  const { visibleBooks, advanceBook, deleteBook, busyIds } = useBooks();

  if (visibleBooks.length === 0) {
    return (
      <p
        data-testid="books-empty"
        className="rounded-xl border border-dashed p-8 text-center text-muted-foreground"
      >
        No books found
      </p>
    );
  }

  return (
    <ul data-testid="book-list" className="space-y-3">
      {visibleBooks.map((book) => {
        const busy = busyIds.includes(book.id);
        const next = nextStatus(book.status);
        return (
          <li key={book.id}>
            <Card
              data-testid="book-item"
              className="flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-1">
                <h3 data-testid="book-title" className="break-words font-semibold">
                  {book.title}
                </h3>
                <p data-testid="book-author" className="break-words text-sm text-muted-foreground">
                  {book.author}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span data-testid="book-pages">{`${book.pages} pages`}</span>
                  <span
                    data-testid="book-status"
                    className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                  >
                    {book.status}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {next && (
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={busy}
                    onClick={() => advanceBook(book.id)}
                    data-testid="btn-advance-status"
                    aria-label={`Advance to ${next}`}
                  >
                    <ArrowRight className="size-4" aria-hidden />
                    Advance
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={busy}
                  onClick={() => deleteBook(book.id)}
                  data-testid="btn-delete-book"
                >
                  <Trash2 className="size-4" aria-hidden />
                  Delete
                </Button>
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
