"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import styles from "./poc-rider-shell.module.css";
import { PocDevNav } from "./poc-dev-nav";
import { usePocSession } from "@/context/poc-session";

export function PocRiderShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { session, resetAll } = usePocSession();
  const label = session.isLoggedIn ? session.riderName || "Rider" : "Login";
  const initial = label.slice(0, 1).toUpperCase();

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <a href="/dashboard" className={styles.logo}>
          Sendy
        </a>
        <details className={styles.profileMenu}>
          <summary className={styles.profileButton}>
            <span className={styles.avatar}>{initial}</span>
            <span>{label}</span>
          </summary>
          <div className={styles.menuPanel}>
            {session.isLoggedIn ? (
              <a href="/rider-profile" className={styles.menuItem}>
                Profile
              </a>
            ) : (
              <a href="/sign-in" className={styles.menuItem}>
                Login
              </a>
            )}
            <a href="/trips" className={styles.menuItem}>
              Trips
            </a>
            {session.isLoggedIn ? (
              <button
                type="button"
                className={styles.menuItemButton}
                onClick={() => {
                  resetAll();
                  router.push("/dashboard");
                }}
              >
                Log out
              </button>
            ) : null}
          </div>
        </details>
      </header>
      <main className={styles.main}>{children}</main>
      <PocDevNav />
    </div>
  );
}
