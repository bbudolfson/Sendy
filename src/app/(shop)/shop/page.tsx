"use client";

import { PocH1 } from "@/components/poc-ui";
import { useShopSession } from "@/context/shop-session";
import { AccountCreationTile } from "@/components/ui/AccountCreationTile/AccountCreationTile";
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
      <div className={styles.page}>
        <AccountCreationTile
          profileComplete={profileComplete}
          paymentComplete={paymentComplete}
          fleetComplete={fleetComplete}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={shopPageStyles.shopPageHeaderRow}>
        <PocH1>Reservations</PocH1>
      </div>

      <section className={styles.section} aria-labelledby="scheduled-heading">
        <h2 id="scheduled-heading" className={styles.sectionTitle}>
          On the schedule
        </h2>
        <div className={styles.cardList}>
          <p className={styles.emptyFilter}>No confirmed reservations yet.</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="open-heading">
        <h2 id="open-heading" className={styles.sectionTitle}>
          Open reservation requests
        </h2>
        <div className={styles.cardList}>
          <p className={styles.emptyFilter}>No open requests yet.</p>
        </div>
      </section>
    </div>
  );
}
