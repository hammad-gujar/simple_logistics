import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Per-request server client bound to the caller's auth cookies.
 * Used by admin pages and all server actions.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase environment variables are missing. Copy .env.example to .env.local and fill in your project credentials.",
    );
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component render — safe to ignore because
          // the proxy refreshes sessions before the request reaches here.
        }
      },
    },
  });
}

/** Requires an authenticated user; throws otherwise. Use inside admin server actions. */
export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorised");
  }
  return { supabase, user };
}
