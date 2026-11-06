"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";
import { STATUSES, nextStatus, type Book, type BookStatus } from "@/lib/books";

type NewBook = { title: string; author: string; pages: number; status: BookStatus };

type Summary = {
  count: number;
  totalPages: number;
  breakdown: { status: BookStatus; count: number }[];
};

type BooksContextValue = {
  /** every book of the logged-in user (newest first) */
  books: Book[];
  /** books after status filter + search */
  visibleBooks: Book[];
  summary: Summary;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  clearFilters: () => void;
  busyIds: string[];
  addBook: (b: NewBook) => Promise<boolean>;
  advanceBook: (id: string) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
};

const BooksContext = createContext<BooksContextValue | null>(null);

type Store = { ownerId: string | null; books: Book[]; loaded: boolean };
const EMPTY: Store = { ownerId: null, books: [], loaded: false };

export function BooksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [store, setStore] = useState<Store>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [busyIds, setBusyIds] = useState<string[]>([]);

  // Load once per logged-in user; wipe everything when the user changes/logs out.
  useEffect(() => {
    setStore(EMPTY);
    setError(null);
    setStatusFilter("");
    setSearch("");
    setBusyIds([]);
    if (!userId) return;

    let active = true;
    getSupabase()
      .from("books")
      .select("id, user_id, title, author, pages, status, created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (!active) return;
        if (err) {
          setError(err.message);
          setStore({ ownerId: userId, books: [], loaded: true });
        } else {
          setStore({ ownerId: userId, books: (data ?? []) as Book[], loaded: true });
        }
      });
    return () => {
      active = false;
    };
  }, [userId]);

  // Never expose another person's books, even for a single render.
  const owned = store.ownerId !== null && store.ownerId === userId;
  const books = useMemo(() => (owned ? store.books : []), [owned, store.books]);
  const loading = userId !== null && !(owned && store.loaded);

  const visibleBooks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return books.filter((b) => {
      if (statusFilter && b.status !== statusFilter) return false;
      if (!q) return true;
      return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
    });
  }, [books, statusFilter, search]);

  const summary = useMemo<Summary>(() => {
    const counts = new Map<BookStatus, number>();
    let totalPages = 0;
    for (const b of visibleBooks) {
      counts.set(b.status, (counts.get(b.status) ?? 0) + 1);
      totalPages += b.pages;
    }
    const breakdown = STATUSES.filter((s) => counts.has(s))
      .map((s) => ({ status: s, count: counts.get(s) ?? 0 }))
      // stable sort: ties keep the To Read → Reading → Finished order
      .sort((a, b) => b.count - a.count);
    return { count: visibleBooks.length, totalPages, breakdown };
  }, [visibleBooks]);

  const clearFilters = useCallback(() => {
    setStatusFilter("");
    setSearch("");
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const addBook = useCallback(
    async (b: NewBook) => {
      if (!userId) return false;
      setError(null);
      const { data, error: err } = await getSupabase()
        .from("books")
        .insert({ ...b, user_id: userId })
        .select("id, user_id, title, author, pages, status, created_at")
        .single();
      if (err || !data) {
        setError(err?.message ?? "Could not add the book");
        return false;
      }
      setStore((s) =>
        s.ownerId === userId ? { ...s, books: [data as Book, ...s.books] } : s
      );
      return true;
    },
    [userId]
  );

  const advanceBook = useCallback(
    async (id: string) => {
      const book = store.books.find((x) => x.id === id);
      if (!book || !userId) return;
      const next = nextStatus(book.status);
      if (!next) return;
      setError(null);
      setBusyIds((ids) => [...ids, id]);
      const { data, error: err } = await getSupabase()
        .from("books")
        .update({ status: next })
        .eq("id", id)
        .select("id");
      setBusyIds((ids) => ids.filter((x) => x !== id));
      if (err || !data || data.length === 0) {
        setError(err?.message ?? "Could not update the book");
        return;
      }
      setStore((s) =>
        s.ownerId === userId
          ? { ...s, books: s.books.map((x) => (x.id === id ? { ...x, status: next } : x)) }
          : s
      );
    },
    [store.books, userId]
  );

  const deleteBook = useCallback(
    async (id: string) => {
      if (!userId) return;
      setError(null);
      setBusyIds((ids) => [...ids, id]);
      const { data, error: err } = await getSupabase()
        .from("books")
        .delete()
        .eq("id", id)
        .select("id");
      setBusyIds((ids) => ids.filter((x) => x !== id));
      if (err || !data || data.length === 0) {
        setError(err?.message ?? "Could not delete the book");
        return;
      }
      setStore((s) =>
        s.ownerId === userId ? { ...s, books: s.books.filter((x) => x.id !== id) } : s
      );
    },
    [userId]
  );

  const value = useMemo<BooksContextValue>(
    () => ({
      books,
      visibleBooks,
      summary,
      loading,
      error,
      clearError,
      statusFilter,
      setStatusFilter,
      search,
      setSearch,
      clearFilters,
      busyIds,
      addBook,
      advanceBook,
      deleteBook,
    }),
    [
      books,
      visibleBooks,
      summary,
      loading,
      error,
      clearError,
      statusFilter,
      search,
      clearFilters,
      busyIds,
      addBook,
      advanceBook,
      deleteBook,
    ]
  );

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}

export function useBooks() {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error("useBooks must be used inside <BooksProvider>");
  return ctx;
}
