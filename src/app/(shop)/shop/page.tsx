"use client";

import { useMemo, useState } from "react";
import { PocH1, PocMuted, PocSelect } from "@/components/poc-ui";
import { ShopReservationCard } from "@/components/ui/ShopReservationCard/ShopReservationCard";
import type { ShopReservationActivity } from "@/lib/domain/types";
import { SHOP_ACTIVITY_OPEN_REQUESTS, SHOP_ACTIVITY_RESERVATIONS_TODAY } from "@/lib/dummy-data";
import {
  reservationStartMatchesFilter,
  type ReservationTimeFilter,
} from "@/lib/reservation-time-filter";
import shopPageStyles from "./shop-pages.module.css";
import styles from "./shop-home.module.css";

function ActivityCard({
  row,
  status,
}: {
  row: ShopReservationActivity;
  status: "pending" | "approved" | "declined";
}) {
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
      bikeDetailsLine={`Bike: ${row.bikeTitle}, Large, No helmet`}
      pickupLine={`Pickup: ${row.startDateDisplay}`}
      returnLine={`Return: ${row.endDateDisplay}`}
      totalChargesLine={totalChargesLine}
      declineReasonLine={status === "declined" ? "Reason: Shop worker enters a note when closing out a request." : undefined}
      editDefaults={{
        bikeSize: "Large",
        helmetSize: "None",
        pickupDate: row.startDateIso,
        returnDate: row.endDateIso,
      }}
      onEdit={() => {}}
      onApprove={() => {}}
      onDecline={() => {}}
      onPickedUp={status === "approved" ? () => {} : undefined}
    />
  );
}

export default function ShopHomePage() {
  return (
    <div className={styles.page}>
      <div className={shopPageStyles.shopPageHeaderRow}>
        <PocH1>Reservations</PocH1>
      </div>

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
