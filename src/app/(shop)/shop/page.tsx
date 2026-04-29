"use client";

import { PocButton } from "@/components/poc-ui";
import { SHOP_ACTIVITY_OPEN_REQUESTS, SHOP_ACTIVITY_RESERVATIONS_TODAY } from "@/lib/dummy-data";
import type { ShopReservationActivity } from "@/lib/domain/types";
import styles from "./shop-home.module.css";

function ActivityCard({
  row,
  actionLabel,
}: {
  row: ShopReservationActivity;
  actionLabel: "Message" | "Approve";
}) {
  return (
    <article className={styles.card}>
      <div className={styles.cardBody}>
        <h3 className={styles.bikeTitle}>{row.bikeTitle}</h3>
        <p className={styles.datesLabel}>Requested dates</p>
        <p className={styles.priceLine}>{row.priceLine}</p>
        <div className={styles.dateRange} aria-label="Requested rental dates">
          <span className={styles.dateCell}>{row.startDateDisplay}</span>
          <span className={styles.dateCell}>{row.endDateDisplay}</span>
        </div>
        <p className={styles.requestedBy}>
          Requested by <span className={styles.requestedName}>{row.requestedBy}</span>
        </p>
        <div className={styles.actionCell}>
          <PocButton type="button" variant="primary" className={styles.action}>
            {actionLabel}
          </PocButton>
        </div>
      </div>
    </article>
  );
}

export default function ShopHomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.section} aria-labelledby="today-heading">
        <h2 id="today-heading" className={styles.sectionTitle}>
          Reservations today
        </h2>
        <div className={styles.cardList}>
          {SHOP_ACTIVITY_RESERVATIONS_TODAY.map((row) => (
            <ActivityCard key={row.id} row={row} actionLabel="Message" />
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="open-heading">
        <h2 id="open-heading" className={styles.sectionTitle}>
          Open reservation requests
        </h2>
        <div className={styles.cardList}>
          {SHOP_ACTIVITY_OPEN_REQUESTS.map((row) => (
            <ActivityCard key={row.id} row={row} actionLabel="Approve" />
          ))}
        </div>
      </section>
    </div>
  );
}
