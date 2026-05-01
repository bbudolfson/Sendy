"use client";

import { PocH1 } from "@/components/poc-ui";
import { SettingsEmbedCard } from "../settings/blocks";
import styles from "../shop-pages.module.css";

export default function ShopEmbedPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shopPageHeaderRow}>
        <PocH1>Embed</PocH1>
      </div>
      <SettingsEmbedCard />
    </div>
  );
}
