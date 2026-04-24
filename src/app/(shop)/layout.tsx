import type { ReactNode } from "react";
import styles from "./shop-layout.module.css";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <a href="/shop" className={styles.logo}>
          Sendy Shop
        </a>
        <a href="/" className={styles.link}>
          Rider app
        </a>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
