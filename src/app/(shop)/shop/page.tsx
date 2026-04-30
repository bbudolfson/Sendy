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
  const [timeFilter, setTimeFilter] = useState<ReservationTimeFilter>("all");

  const confirmedRows = useMemo(
    () =>
      SHOP_ACTIVITY_RESERVATIONS_TODAY.filter((row) =>
        reservationStartMatchesFilter(row.startDateIso, timeFilter),
      ),
    [timeFilter],
  );

  const openRows = useMemo(
    () =>
      SHOP_ACTIVITY_OPEN_REQUESTS.filter((row) =>
        reservationStartMatchesFilter(row.startDateIso, timeFilter),
      ),
    [timeFilter],
  );

  return (
    <div className={styles.page}>
      <div className={shopPageStyles.shopPageHeaderRow}>
        <PocH1>Reservations</PocH1>
        <div className={shopPageStyles.shopPageHeaderActions}>
          <div className={shopPageStyles.inventoryFilterGroup}>
            <PocMuted>Date range</PocMuted>
            <PocSelect
              className={shopPageStyles.inventoryFilterControl}
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.currentTarget.value as ReservationTimeFilter)}
              aria-label="Reservation date range"
            >
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
              <option value="all">All</option>
            </PocSelect>
          </div>
        </div>
      </div>

      <section className={styles.section} aria-labelledby="scheduled-heading">
        <h2 id="scheduled-heading" className={styles.sectionTitle}>
          On the schedule
        </h2>
        <div className={styles.cardList}>
          {confirmedRows.length === 0 ? (
            <p className={styles.emptyFilter}>No confirmed reservations in this range.</p>
          ) : (
            confirmedRows.map((row) => <ActivityCard key={row.id} row={row} status="approved" />)
          )}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="open-heading">
        <h2 id="open-heading" className={styles.sectionTitle}>
          Open reservation requests
        </h2>
        <div className={styles.cardList}>
          {openRows.length === 0 ? (
            <p className={styles.emptyFilter}>No open requests in this range.</p>
          ) : (
            openRows.map((row) => <ActivityCard key={row.id} row={row} status="pending" />)
          )}
        </div>
      </section>
    </div>
  );
}
