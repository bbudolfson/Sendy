"use client";

import { useRouter } from "next/navigation";
import { usePocSession } from "@/context/poc-session";
import styles from "./rider-avatar-menu.module.css";

export type RiderAvatarMenuVariant = "surface" | "hero";

type Props = { variant?: RiderAvatarMenuVariant };

export function RiderAvatarMenu({ variant = "surface" }: Props) {
  const router = useRouter();
  const { session, resetAll, openAuthModal } = usePocSession();
  const menuLabel = session.isLoggedIn ? session.riderName || "Rider" : "Login";
  /** Two-letter monogram: guest shows "LO"; short names duplicate the letter (e.g. "A" → "AA"). */
  const initials = (() => {
    const t = menuLabel.trim();
    if (t.length >= 2) return t.slice(0, 2).toUpperCase();
    const one = (t.slice(0, 1) || "?").toUpperCase();
    return `${one}${one}`;
  })();

  return (
    <details className={styles.details} data-variant={variant}>
      <summary className={styles.summary}>
        <span className={styles.avatarRing}>
          <span className={styles.avatar} aria-hidden>
            {initials}
          </span>
        </span>
        <span className={styles.srOnly}>Account menu ({menuLabel})</span>
      </summary>
      <div className={styles.menuPanel}>
        {session.isLoggedIn ? (
          <a href="/rider-profile" className={styles.menuItem}>
            Profile
          </a>
        ) : (
          <button type="button" className={styles.menuItemButton} onClick={() => openAuthModal("sign-in")}>
            Login
          </button>
        )}
        <a href="/trips" className={styles.menuItem}>
          Trips
        </a>
        <a href="/shop" className={styles.menuItem}>
          Switch to shop
        </a>
        {session.isLoggedIn ? (
          <div className={styles.menuFooter}>
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
          </div>
        ) : null}
      </div>
    </details>
  );
}
