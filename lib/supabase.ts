import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Browser Supabase client. Only the public URL + anon key are used
 * (read from NEXT_PUBLIC_* environment variables, never hard-coded).
 */
export function getSupabase(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    // Placeholders only keep a build/prerender without env vars from crashing;
    // real requests need the two variables to be set.
    client = createClient(url || "http://localhost:54321", key || "missing-anon-key", {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return client;
}

