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
import styles from "./poc-auth-modal.module.css";

export function PocAuthModal() {
  const router = useRouter();
  const { session, patch, closeAuthModal, openAuthModal } = usePocSession();

  if (!session.authModal) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div className={styles.panel}>
        {session.authModal === "sign-in" ? (
          <PocCard>
            <PocStack gap="md">
              <div className={styles.topRow}>
                <button
                  type="button"
                  className={styles.close}
                  aria-label="Close auth modal"
                  onClick={closeAuthModal}
                >
                  ×
                </button>
              </div>
              <PocH1>Sign in</PocH1>
              <PocMuted>Sign in to save profile, trips, and checkout info.</PocMuted>
              <PocStack gap="sm">
                <div>
                  <PocLabel>Email</PocLabel>
                  <PocInput type="email" placeholder="you@example.com" />
                </div>
                <div>
                  <PocLabel>Password</PocLabel>
                  <PocInput type="password" placeholder="••••••••" />
                </div>
                <PocButton
                  type="button"
                  onClick={() => {
                    patch({
                      isLoggedIn: true,
                      riderName: "Alex Rider",
                      isReturningUser: true,
                      hasCompletedFtue: true,
                      authModal: null,
                    });
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
                      authModal: null,
                    });
                    router.push("/ftue/profile");
                  }}
                >
                  Sign in with Google
                </PocButton>
                <PocButton
                  type="button"
                  variant="secondary"
                  onClick={() => openAuthModal("create-account")}
                >
                  Create account
                </PocButton>
                <a href="/forgot-password" style={{ fontSize: "0.875rem" }}>
                  Forgot password
                </a>
              </PocStack>
            </PocStack>
          </PocCard>
        ) : (
          <PocCard>
            <PocStack gap="md">
              <div className={styles.topRow}>
                <button
                  type="button"
                  className={styles.close}
                  aria-label="Close auth modal"
                  onClick={closeAuthModal}
                >
                  ×
                </button>
              </div>
              <PocH1>Create account</PocH1>
              <PocMuted>Dummy form — account creation routes to sign-in.</PocMuted>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  openAuthModal("sign-in");
                }}
              >
                <PocStack gap="md">
                  <div>
                    <PocLabel>Email</PocLabel>
                    <PocInput name="email" type="email" required placeholder="you@example.com" />
                  </div>
                  <div>
                    <PocLabel>Password</PocLabel>
                    <PocInput name="password" type="password" required minLength={4} />
                  </div>
                  <PocButton type="submit">Create account</PocButton>
                </PocStack>
              </form>
              <button
                type="button"
                onClick={() => openAuthModal("sign-in")}
                style={{
                  border: 0,
                  background: "transparent",
                  textAlign: "left",
                  fontSize: "0.875rem",
                  color: "var(--color-text-muted)",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Already have an account? Sign in
              </button>
            </PocStack>
          </PocCard>
        )}
      </div>
    </div>
  );
}
