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
        <span className={styles.badge}>Rider POC</span>
      </header>
      <main className={styles.main}>{children}</main>
      <PocDevNav />
    </div>
  );
}
