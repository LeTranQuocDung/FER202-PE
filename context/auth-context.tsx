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
import type { User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";

type AuthResult = { error: string | null };

type AuthContextValue = {
  user: User | null;
  /** true while we are still finding out whether someone is logged in */
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    // Set the user right away so protected pages never see a "logged out" gap.
    setUser(data.session?.user ?? data.user ?? null);
    setLoading(false);
    return { error: null };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { data, error } = await getSupabase().auth.signUp({ email, password });
    if (error) return { error: error.message };
    if (data.session?.user) setUser(data.session.user);
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    await getSupabase().auth.signOut();
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut }),
    [user, loading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

