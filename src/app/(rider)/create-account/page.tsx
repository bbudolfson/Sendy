"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "@/app/actions/auth";
import {
  PocButton,
  PocCard,
  PocH1,
  PocInput,
  PocLabel,
  PocMuted,
  PocStack,
} from "@/components/poc-ui";
import { useSupabase } from "@/context/supabase-provider";
import styles from "../auth-modal.module.css";

export default function CreateAccountPage() {
  const router = useRouter();
  const { configured } = useSupabase();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const fd = new FormData(event.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    const fullName = String(fd.get("fullName") ?? "");

    if (!configured) {
      router.push("/sign-in");
      return;
    }

    setPending(true);
    const result = await signUp(email, password, "rider", fullName);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMessage("Check your email to confirm your account, then sign in.");
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <a href="/dashboard" className={styles.closeButton} aria-label="Close create account">
          ×
        </a>
        <PocCard>
          <form onSubmit={handleSubmit}>
            <PocStack gap="md">
              <PocH1>Create account</PocH1>
              <PocMuted>Rider account for booking bikes.</PocMuted>
              {error ? <p role="alert">{error}</p> : null}
              {message ? <p>{message}</p> : null}
              <div>
                <PocLabel>Full name</PocLabel>
                <PocInput name="fullName" placeholder="Alex Rider" />
              </div>
              <div>
                <PocLabel>Email</PocLabel>
                <PocInput name="email" type="email" required placeholder="you@example.com" />
              </div>
              <div>
                <PocLabel>Password</PocLabel>
                <PocInput name="password" type="password" required minLength={8} />
              </div>
              <PocButton type="submit" disabled={pending}>
                {pending ? "Creating…" : "Create account"}
              </PocButton>
            </PocStack>
          </form>
          <a href="/sign-in" className={styles.subtleLink}>
            Already have an account? Sign in
          </a>
        </PocCard>
      </div>
    </div>
  );
}
