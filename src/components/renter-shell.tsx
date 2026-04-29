"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import styles from "./renter-shell.module.css";

const NAV_ITEMS = [
  { href: "/shop", label: "Dashboard" },
  { href: "/shop/profile", label: "Profile" },
  { href: "/shop/inventory", label: "Inventory" },
  { href: "/shop/payments", label: "Payments" },
  { href: "/shop/embed", label: "Embed" },
];

export function RenterShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <a href="/shop" className={styles.logo}>
          Sendy Renter
        </a>
        <div className={styles.rightLinks}>
          <a href="/dashboard" className={styles.link}>
            Rider app
          </a>
        </div>
      </header>
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            data-active={pathname === item.href || pathname.startsWith(`${item.href}/`) || undefined}
            className={styles.navLink}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
