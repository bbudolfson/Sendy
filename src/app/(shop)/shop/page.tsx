"use client";

import { PocH1 } from "@/components/poc-ui";
import { useShopSession } from "@/context/shop-session";
import { AccountCreationTile } from "@/components/ui/AccountCreationTile/AccountCreationTile";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import {
  isShopFleetReady,
  isShopPaymentReadyForRentals,
  isShopProfileReadyForRenters,
  isShopReservationsDashboardUnlocked,
} from "@/lib/shop-onboarding-status";
import shopPageStyles from "./shop-pages.module.css";
import styles from "./shop-home.module.css";

export default function ShopHomePage() {
  const { session } = useShopSession();

  const profileComplete = isShopProfileReadyForRenters(session.profile);
  const paymentComplete = isShopPaymentReadyForRentals(session.payment);
  const fleetComplete = isShopFleetReady(session.inventory);

  const reservationsUnlocked = isShopReservationsDashboardUnlocked(session.profile, session.payment, session.inventory);

  if (!reservationsUnlocked) {
    return (
      <div className={shopPageStyles.page}>
        <AccountCreationTile
          profileComplete={profileComplete}
          paymentComplete={paymentComplete}
          fleetComplete={fleetComplete}
        />
      </div>
    );
  }

  return (
    <div className={shopPageStyles.page}>
      <div className={shopPageStyles.shopPageHeaderRow}>
        <PocH1>Reservations</PocH1>
      </div>

      <div className={styles.content}>
      <section className={styles.section} aria-labelledby="scheduled-heading">
        <h2 id="scheduled-heading" className={styles.sectionTitle}>
          On the schedule
        </h2>
        <div className={styles.cardList}>
          <EmptyState
            title="No Reservations Today."
            description="Give a shout out to your rentals on social media and we’ll help get more Freewheelers in your door."
            actions={[
              { label: "Share on Facebook", href: "https://www.facebook.com/sharer/sharer.php" },
              { label: "Share on Instagram", href: "https://www.instagram.com" },
            ]}
          />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="open-heading">
        <h2 id="open-heading" className={styles.sectionTitle}>
          Open reservation requests
        </h2>
        <div className={styles.cardList}>
          <EmptyState
            title="No open requests."
            description="When riders request a booking, it will show up here for you to review."
          />
        </div>
      </section>
      </div>
    </div>
  );
}
