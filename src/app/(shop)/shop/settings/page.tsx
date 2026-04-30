"use client";

import { PocButtonLink, PocCard, PocH1, PocMuted, PocStack } from "@/components/poc-ui";
import styles from "../shop-pages.module.css";

export default function ShopSettingsHubPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shopPageHeaderRow}>
        <PocH1>Settings</PocH1>
      </div>
      <PocMuted>Manage your shop profile, payouts, and embeddable booking links.</PocMuted>
      <PocStack gap="md">
        <PocCard>
          <PocStack gap="sm">
            <PocButtonLink href="/shop/profile">Shop profile</PocButtonLink>
            <PocMuted>Address, website, logo, service area notes, and contact details.</PocMuted>
          </PocStack>
        </PocCard>
        <PocCard>
          <PocStack gap="sm">
            <PocButtonLink href="/shop/payments">Payments</PocButtonLink>
            <PocMuted>Stripe connection and payout status.</PocMuted>
          </PocStack>
        </PocCard>
        <PocCard>
          <PocStack gap="sm">
            <PocButtonLink href="/shop/embed">Embed</PocButtonLink>
            <PocMuted>Links for your website.</PocMuted>
          </PocStack>
        </PocCard>
      </PocStack>
    </div>
  );
}
