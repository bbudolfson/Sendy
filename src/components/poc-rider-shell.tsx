import type { ReactNode } from "react";
import styles from "./poc-rider-shell.module.css";
import { PocDevNav } from "./poc-dev-nav";

export function PocRiderShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <a href="/dashboard" className={styles.logo}>
          Sendy
        </a>
        <details className={styles.profileMenu}>
          <summary className={styles.profileButton}>Profile</summary>
          <div className={styles.menuPanel}>
            <a href="/rider-profile" className={styles.menuItem}>
              Profile
            </a>
            <a href="/trips" className={styles.menuItem}>
              Trips
            </a>
          </div>
        </details>
      </header>
      <main className={styles.main}>{children}</main>
      <PocDevNav />
    </div>
  );
}
