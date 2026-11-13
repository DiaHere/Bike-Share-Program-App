"use client";

import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./AuthGate.module.css";
import ui from "./ui.module.css";

// Shows the site only to a signed-in admin. This is for convenience:
// the database's row-level security is what actually blocks writes.
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  async function signIn() {
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setError("That email and password didn't match. Try again.");
    setBusy(false);
  }

  // Until the browser has read the session, render the site hidden so Next.js can still prerender every page.
  if (session === undefined || session?.user.app_metadata.role === "admin") {
    return <div hidden={session === undefined}>{children}</div>;
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1>Whitman Bike Share</h1>
        {session ? (
          <>
            <p>{session.user.email} is not an admin account.</p>
            <button type="button" className={ui.secondary} onClick={() => supabase.auth.signOut()}>
              Sign out
            </button>
          </>
        ) : (
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              signIn();
            }}
          >
            <p>Sign in with an admin account.</p>
            <div className={ui.field}>
              <label htmlFor="signin-email">Email</label>
              <input
                id="signin-email"
                type="email"
                autoComplete="username"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={ui.field}>
              <label htmlFor="signin-password">Password</label>
              <input
                id="signin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
            <button type="submit" className={ui.primary} disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
