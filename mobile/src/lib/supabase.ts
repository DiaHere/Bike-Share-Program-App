import { createClient } from '@supabase/supabase-js';

// The app only reads public data until sign-in arrives in Sprint 4, so no session is stored.
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
);
