import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Read-only server client used by Server Components on the storefront.
// No session persistence (nothing to persist server-side), and every
// fetch is forced to `cache: "no-store"` so admin edits show up on the
// storefront immediately, without waiting on Next.js's Data Cache or a
// redeploy/revalidation window.
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  global: {
    fetch: (url, options = {}) =>
      fetch(url, { ...options, cache: "no-store" }),
  },
});
