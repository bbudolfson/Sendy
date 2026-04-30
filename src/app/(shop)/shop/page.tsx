"use client";

import { ShopReservationCard } from "@/components/ui/ShopReservationCard/ShopReservationCard";
import { SHOP_ACTIVITY_OPEN_REQUESTS, SHOP_ACTIVITY_RESERVATIONS_TODAY } from "@/lib/dummy-data";
import type { ShopReservationActivity } from "@/lib/domain/types";
import styles from "./shop-home.module.css";

function ActivityCard({
  row,
  status,
}: {
  row: ShopReservationActivity;
  status: "pending" | "approved" | "declined";
}) {
  const detailTitle = status === "declined" ? "Request Declined" : "Request Details";
  const totalChargesLine =
    status === "pending" ? "Total Charges: $475.00 (3 days + Accessories)" : "Total Charges: $475.00";
  return (
    <ShopReservationCard
      bikeTitle={row.bikeTitle}
      priceLine={row.priceLine}
      status={status}
      requestedBy={row.requestedBy}
      email="bbudolfson@gmail.com"
      phone="(555) 332-2230"
      detailsTitle={detailTitle}
      bikeDetailsLine={`Bike: ${row.bikeTitle}, L, Helmet`}
      pickupLine={`Pickup: ${row.startDateDisplay}`}
      returnLine={`Return: ${row.endDateDisplay}`}
      totalChargesLine={totalChargesLine}
      declineReasonLine={status === "declined" ? "Reason: Shop worker enters a note when closing out a request." : undefined}
      onEdit={() => {}}
      onApprove={() => {}}
      onDecline={() => {}}
    />
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
            <ActivityCard key={row.id} row={row} status="approved" />
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="open-heading">
        <h2 id="open-heading" className={styles.sectionTitle}>
          Open reservation requests
        </h2>
        <div className={styles.cardList}>
          {SHOP_ACTIVITY_OPEN_REQUESTS.map((row) => (
            <ActivityCard key={row.id} row={row} status="pending" />
          ))}
        </div>
      </section>
    </div>
  );
}
