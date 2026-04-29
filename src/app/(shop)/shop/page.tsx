"use client";

import { PocButtonLink, PocCard, PocH1, PocH2, PocMuted, PocStack } from "@/components/poc-ui";
import { useShopSession } from "@/context/shop-session";
import styles from "./shop-pages.module.css";

export default function ShopHomePage() {
  const { session, profileCompletion, canPublishInventory } = useShopSession();
  const activeCount = session.inventory.filter((bike) => bike.status === "active").length;

  return (
    <div className={styles.page}>
      <PocH1>Shop dashboard</PocH1>
      <div className={styles.grid}>
        <PocCard>
          <PocStack gap="md">
            <PocH2>{session.profile.shopName}</PocH2>
            <PocMuted>
              Profile completion: {profileCompletion}% {canPublishInventory ? "(publish-ready)" : "(needs setup)"}
            </PocMuted>
            <div className={styles.chipRow}>
              <span className={styles.chip}>{activeCount} active bikes</span>
              <span className={styles.chip}>{session.deliveryZones.length} delivery zones</span>
              <span className={styles.chip}>Payments: {session.payment.status.replace("_", " ")}</span>
            </div>
          </PocStack>
        </PocCard>
        <PocCard>
          <PocStack gap="sm">
            <PocH2>Quick actions</PocH2>
            <div className={styles.actions}>
              <PocButtonLink href="/shop/profile">Edit profile</PocButtonLink>
              <PocButtonLink href="/shop/inventory" variant="secondary">
                Manage inventory
              </PocButtonLink>
              <PocButtonLink href="/shop/payments" variant="secondary">
                Review payouts
              </PocButtonLink>
              <PocButtonLink href="/shop/embed" variant="secondary">
                Embed links
              </PocButtonLink>
            </div>
          </PocStack>
        </PocCard>
      </div>
    </div>
  );
}
