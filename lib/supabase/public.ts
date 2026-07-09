import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-less anonymous client used for public, cacheable reads
 * (safe inside unstable_cache — carries no per-request state).
 * Returns null when the project is not yet linked to Supabase so the
 * site can still build and render with fallback content.
 */
export function createPublicClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
