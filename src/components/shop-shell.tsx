"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useShopSession } from "@/context/shop-session";
import styles from "./shop-shell.module.css";

const MENU_LINKS: { href: string; label: string; isActive: (path: string) => boolean }[] = [
  { href: "/shop", label: "Reservations", isActive: (p) => p === "/shop" },
  {
    href: "/shop/inventory",
    label: "Fleet",
    isActive: (p) => p.startsWith("/shop/inventory"),
  },
  {
    href: "/shop/settings",
    label: "Settings",
    isActive: (p) => p.startsWith("/shop/settings"),
  },
  { href: "/shop/profile", label: "Profile", isActive: (p) => p.startsWith("/shop/profile") },
  { href: "/shop/payments", label: "Payments", isActive: (p) => p.startsWith("/shop/payments") },
  { href: "/shop/embed", label: "Embed", isActive: (p) => p.startsWith("/shop/embed") },
  { href: "/dashboard", label: "Rider app", isActive: () => false },
];

export function ShopShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { session } = useShopSession();
  const owner = session.profile.ownerName.trim();
  const initials =
    owner.length >= 2
      ? owner.slice(0, 2).toUpperCase()
      : `${(owner.slice(0, 1) || "?").toUpperCase()}${(owner.slice(0, 1) || "?").toUpperCase()}`;

  const primary = MENU_LINKS.slice(0, 3);
  const secondary = MENU_LINKS.slice(3);

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <a href="/shop" className={styles.logo} aria-label="Fitted shop workspace">
          <img src="/fitted-logo.png" alt="" className={styles.logoImg} />
          <span className={styles.logoSuffix}>Shop</span>
        </a>
        <div className={styles.headerRight}>
          <details className={styles.accountMenu}>
            <summary className={styles.accountSummary}>
              <span className={styles.avatarRing}>
                <span className={styles.avatar} aria-hidden>
                  {initials}
                </span>
              </span>
              <span className={styles.srOnly}>Shop menu ({session.profile.ownerName})</span>
            </summary>
            <div className={styles.menuPanel}>
              {primary.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={styles.menuItem}
                  data-active={item.isActive(pathname) || undefined}
                >
                  {item.label}
                </a>
              ))}
              <div className={styles.menuDivider} aria-hidden />
              {secondary.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={styles.menuItem}
                  data-active={item.isActive(pathname) || undefined}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </details>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
