"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBooks } from "@/context/books-context";
import { STATUSES } from "@/lib/books";
import { selectClass } from "@/components/book-form";

export function BookFilters() {
  const { statusFilter, setStatusFilter, search, setSearch, clearFilters } = useBooks();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="space-y-1.5 sm:w-44">
        <Label htmlFor="filter-status">Status</Label>
        <select
          id="filter-status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          data-testid="filter-status"
          className={selectClass}
        >
          <option value="">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <Label htmlFor="search-input">Search</Label>
        <Input
          id="search-input"
          type="text"
          placeholder="Title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="search-input"
        />
      </div>
      <Button type="button" variant="outline" onClick={clearFilters} data-testid="btn-clear-filters">
        Clear
      </Button>
    </div>
  );
}

export function BookSummary() {
  const { summary } = useBooks();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-lg bg-muted p-3">
            <dd data-testid="book-count" className="text-2xl font-bold">
              {summary.count}
            </dd>
            <dt className="text-xs text-muted-foreground">Books</dt>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <dd data-testid="total-pages" className="text-2xl font-bold">
              {summary.totalPages}
            </dd>
            <dt className="text-xs text-muted-foreground">Total pages</dt>
          </div>
        </dl>
        <div data-testid="status-breakdown" className="space-y-1.5">
          {summary.breakdown.map((row) => (
            <div
              key={row.status}
              data-testid="breakdown-row"
              className="flex items-center justify-between rounded-md border px-3 py-1.5 text-sm"
            >
              <span data-testid="breakdown-name">{row.status}</span>
              <span data-testid="breakdown-count" className="font-semibold">
                {row.count}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
