"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useShopSession } from "@/context/shop-session";
import styles from "./shop-shell.module.css";

type MenuLink = { href: string; label: string; isActive: (path: string) => boolean };

const PRIMARY_MENU_LINKS: MenuLink[] = [
  { href: "/shop", label: "Reservations", isActive: (p) => p === "/shop" },
  {
    href: "/shop/inventory",
    label: "Fleet",
    isActive: (p) => p.startsWith("/shop/inventory"),
  },
  { href: "/shop/profile", label: "Profile", isActive: (p) => p.startsWith("/shop/profile") },
  {
    href: "/shop/settings",
    label: "Settings",
    isActive: (p) =>
      p.startsWith("/shop/settings") || p.startsWith("/shop/payments") || p.startsWith("/shop/embed"),
  },
];

const RIDER_APP_LINK: MenuLink = {
  href: "/dashboard",
  label: "Rider app",
  isActive: () => false,
};

export function ShopShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, resetShopSession } = useShopSession();
  const shopLabel = session.profile.shopName.trim();
  const initials =
    shopLabel.length >= 2
      ? shopLabel.slice(0, 2).toUpperCase()
      : `${(shopLabel.slice(0, 1) || "?").toUpperCase()}${(shopLabel.slice(0, 1) || "?").toUpperCase()}`;

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
              <span className={styles.srOnly}>Shop menu ({session.profile.shopName})</span>
            </summary>
            <div className={styles.menuPanel}>
              {PRIMARY_MENU_LINKS.map((item) => (
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
              <a
                href={RIDER_APP_LINK.href}
                className={styles.menuItem}
                data-active={RIDER_APP_LINK.isActive(pathname) || undefined}
              >
                {RIDER_APP_LINK.label}
              </a>
              <div className={styles.menuFooter}>
                <button
                  type="button"
                  className={styles.menuItemButton}
                  onClick={() => {
                    resetShopSession();
                    router.push("/shop");
                  }}
                >
                  Log out
                </button>
              </div>
            </div>
          </details>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
