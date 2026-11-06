"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBooks } from "@/context/books-context";
import { STATUSES, validateBook, type BookStatus } from "@/lib/books";

export const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm";

export function BookForm() {
  const { addBook, error, clearError } = useBooks();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState("");
  const [status, setStatus] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  const values = { title, author, pages, status };
  const errors = submitted ? validateBook(values) : {};

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setSuccess(false);
    clearError();
    if (Object.keys(validateBook(values)).length > 0) return;

    setPending(true);
    const ok = await addBook({
      title: title.trim(),
      author: author.trim(),
      pages: Number(pages.trim()),
      status: status as BookStatus,
    });
    setPending(false);
    if (!ok) return;

    setTitle("");
    setAuthor("");
    setPages("");
    setStatus("");
    setSubmitted(false);
    setSuccess(true);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a book</CardTitle>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={onSubmit} data-testid="book-form" className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="input-title">Title</Label>
            <Input
              id="input-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-title"
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p data-testid="error-title" className="text-sm text-destructive">
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="input-author">Author</Label>
            <Input
              id="input-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              data-testid="input-author"
              aria-invalid={!!errors.author}
            />
            {errors.author && (
              <p data-testid="error-author" className="text-sm text-destructive">
                {errors.author}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="input-pages">Pages</Label>
            <Input
              id="input-pages"
              type="text"
              inputMode="numeric"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              data-testid="input-pages"
              aria-invalid={!!errors.pages}
            />
            {errors.pages && (
              <p data-testid="error-pages" className="text-sm text-destructive">
                {errors.pages}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="select-status">Status</Label>
            <select
              id="select-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              data-testid="select-status"
              aria-invalid={!!errors.status}
              className={selectClass}
            >
              <option value="">Choose status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.status && (
              <p data-testid="error-status" className="text-sm text-destructive">
                {errors.status}
              </p>
            )}
          </div>

          {error && (
            <p data-testid="error-book" className="text-sm text-destructive">
              {error}
            </p>
          )}
          {success && (
            <p data-testid="book-success" className="text-sm font-medium text-green-700">
              Book added
            </p>
          )}

          <Button type="submit" className="w-full" disabled={pending} data-testid="btn-add-book">
            Add book
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

