"use client";

import styles from "./rider-avatar-menu.module.css";

/** Avatar menu on shop login / FTUE — mirrors rider menu with switch to rider app. */
export function ShopFtueAccountMenu() {
  return (
    <details className={styles.details} data-variant="hero">
      <summary className={styles.summary}>
        <span className={styles.avatarRing}>
          <span className={styles.avatar} aria-hidden>
            SH
          </span>
        </span>
        <span className={styles.srOnly}>Shop account menu</span>
      </summary>
      <div className={styles.menuPanel}>
        <a href="/dashboard" className={styles.menuItem}>
          Switch to rider
        </a>
      </div>
    </details>
  );
}
