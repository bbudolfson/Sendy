"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./poc-rider-shell.module.css";
import { PocDevNav } from "./poc-dev-nav";
import { PocAuthModal } from "./poc-auth-modal";
import { usePocSession } from "@/context/poc-session";

export function PocRiderShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, resetAll, openAuthModal } = usePocSession();
  const label = session.isLoggedIn ? session.riderName || "Rider" : "Login";
  const initial = label.slice(0, 1).toUpperCase();
  const hideHeader = pathname === "/dashboard";

  return (
    <div className={styles.wrap}>
      {!hideHeader ? (
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
                <button
                  type="button"
                  className={styles.menuItemButton}
                  onClick={() => openAuthModal("sign-in")}
                >
                  Login
                </button>
              )}
              <a href="/trips" className={styles.menuItem}>
                Trips
              </a>
              <a href="/shop" className={styles.menuItem}>
                Switch to renter
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
      ) : null}
      <main className={`${styles.main} ${hideHeader ? styles.mainDashboard : ""}`}>{children}</main>
      <PocAuthModal />
      <PocDevNav />
    </div>
  );
}
