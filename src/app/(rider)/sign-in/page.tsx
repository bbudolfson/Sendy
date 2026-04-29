"use client";

import { useRouter } from "next/navigation";
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
import styles from "../auth-modal.module.css";

export default function SignInPage() {
  const router = useRouter();
  const { patch } = usePocSession();

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <a href="/dashboard" className={styles.closeButton} aria-label="Close sign in">
          ×
        </a>
        <PocCard>
          <PocStack gap="md">
            <PocH1>Sign in</PocH1>
            <PocMuted>Sign in to save profile, trips, and checkout info.</PocMuted>
            <PocStack gap="sm">
              <PocLabel>Email</PocLabel>
              <PocInput type="email" placeholder="you@example.com" />
              <PocLabel>Password</PocLabel>
              <PocInput type="password" placeholder="••••••••" />
            </PocStack>
            <PocStack gap="sm">
              <PocButton
                type="button"
                onClick={() => {
                  patch({
                    isLoggedIn: true,
                    riderName: "Alex Rider",
                    isReturningUser: true,
                    hasCompletedFtue: true,
                  });
                  router.push("/dashboard");
                }}
              >
                Sign in
              </PocButton>
              <PocButton
                type="button"
                variant="secondary"
                onClick={() => {
                  patch({
                    isLoggedIn: true,
                    riderName: "Alex Rider",
                    isReturningUser: false,
                    hasCompletedFtue: false,
                  });
                  router.push("/ftue/profile");
                }}
              >
                Sign in with Google
              </PocButton>
              <PocButton
                type="button"
                variant="secondary"
                onClick={() => router.push("/create-account")}
              >
                Create account
              </PocButton>
            </PocStack>
            <a href="/forgot-password" className={styles.subtleLink}>
              Forgot password
            </a>
          </PocStack>
        </PocCard>
      </div>
    </div>
  );
}
