"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import styles from "./poc-rider-shell.module.css";
import { PocDevNav } from "./poc-dev-nav";
import { PocAuthModal } from "./poc-auth-modal";
import { RiderAvatarMenu } from "@/components/rider-avatar-menu";

export function PocRiderShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideHeader = pathname === "/dashboard";

  return (
    <div className={styles.wrap}>
      {!hideHeader ? (
        <header className={styles.header}>
          <a href="/dashboard" className={styles.logo} aria-label="Fitted home">
            <img src="/fitted-logo.png" alt="" className={styles.logoImg} />
          </a>
          <RiderAvatarMenu variant="surface" />
        </header>
      ) : null}
      <main className={`${styles.main} ${hideHeader ? styles.mainDashboard : ""}`}>{children}</main>
      <PocAuthModal />
      <PocDevNav />
    </div>
  );
}
