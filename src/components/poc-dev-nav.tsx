"use client";

import { usePocSession } from "@/context/poc-session";
import styles from "./poc-dev-nav.module.css";

const LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Landing" },
  { href: "/sign-in", label: "Sign in" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/plan/trip-details", label: "Trip details" },
  { href: "/plan/browse", label: "Browse" },
  { href: "/plan/bikes", label: "Bikes" },
  { href: "/checkout", label: "Checkout" },
  { href: "/shop", label: "Shop shell" },
];

export function PocDevNav() {
  const { resetReservation, resetAll, session } = usePocSession();

  return (
    <footer className={styles.footer}>
      <details className={styles.details}>
        <summary>POC data &amp; routes</summary>
        <div className={styles.grid}>
          <div>
            <p className={styles.title}>Session snapshot</p>
            <pre className={styles.pre}>{JSON.stringify(session, null, 2)}</pre>
            <div className={styles.row}>
              <button type="button" className={styles.btn} onClick={resetReservation}>
                Clear trip / checkout
              </button>
              <button type="button" className={styles.btn} onClick={resetAll}>
                Reset all
              </button>
            </div>
          </div>
          <div>
            <p className={styles.title}>Jump links</p>
            <ul className={styles.list}>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
            <p className={styles.hint}>
              Try location <code>Moab</code> (delivery on) or <code>Bend</code>{" "}
              (pickup only). Use <code>ghost town</code> to test request market.
            </p>
          </div>
        </div>
      </details>
    </footer>
  );
}
