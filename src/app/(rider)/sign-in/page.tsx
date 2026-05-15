"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "@/app/actions/auth";
import {
  PocButton,
  PocCard,
  PocH1,
  PocInput,
  PocLabel,
  PocMuted,
  PocStack,
} from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";
import { useSupabase } from "@/context/supabase-provider";
import styles from "../auth-modal.module.css";

export default function SignInPage() {
  const router = useRouter();
  const { patch } = usePocSession();
  const { configured } = useSupabase();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const fd = new FormData(event.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");

    if (configured) {
      setPending(true);
      const result = await signIn(email, password);
      setPending(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/dashboard");
      router.refresh();
      return;
    }

    patch({
      isLoggedIn: true,
      riderName: "Alex Rider",
      isReturningUser: true,
      hasCompletedFtue: true,
    });
    router.push("/dashboard");
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <a href="/dashboard" className={styles.closeButton} aria-label="Close sign in">
          ×
        </a>
        <PocCard>
          <form onSubmit={handleSubmit}>
            <PocStack gap="md">
              <PocH1>Sign in</PocH1>
              <PocMuted>
                {configured
                  ? "Sign in with your Sendy account."
                  : "Supabase not configured — using demo sign-in."}
              </PocMuted>
              {error ? <p role="alert">{error}</p> : null}
              <PocStack gap="sm">
                <PocLabel>Email</PocLabel>
                <PocInput name="email" type="email" placeholder="you@example.com" required />
                <PocLabel>Password</PocLabel>
                <PocInput name="password" type="password" placeholder="••••••••" required />
              </PocStack>
              <PocButton type="submit" disabled={pending}>
                {pending ? "Signing in…" : "Sign in"}
              </PocButton>
              <PocButton type="button" variant="secondary" onClick={() => router.push("/create-account")}>
                Create account
              </PocButton>
            </PocStack>
          </form>
        </PocCard>
      </div>
    </div>
  );
}
