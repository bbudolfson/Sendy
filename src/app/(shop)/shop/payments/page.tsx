"use client";

import { PocH1 } from "@/components/poc-ui";
import { SettingsPaymentsCard } from "../settings/blocks";
import styles from "../shop-pages.module.css";

export default function ShopPaymentsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shopPageHeaderRow}>
        <PocH1>Payments</PocH1>
      </div>
      <SettingsPaymentsCard />
    </div>
  );
}
