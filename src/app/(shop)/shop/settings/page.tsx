"use client";

import { PocH1, PocH2, PocMuted } from "@/components/poc-ui";
import styles from "../shop-pages.module.css";
import { SettingsEmbedCard, SettingsPaymentsCard } from "./blocks";
import blockStyles from "./blocks.module.css";

export default function ShopSettingsHubPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shopPageHeaderRow}>
        <PocH1>Settings</PocH1>
      </div>
      <PocMuted>Manage payouts and website booking embeds.</PocMuted>
      <div className={blockStyles.settingsStack}>
        <section className={blockStyles.settingSection}>
          <PocH2>Payments</PocH2>
          <SettingsPaymentsCard />
        </section>
        <section className={blockStyles.settingSection}>
          <PocH2>Embed</PocH2>
          <SettingsEmbedCard />
        </section>
      </div>
    </div>
  );
}
