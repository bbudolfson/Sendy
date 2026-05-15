"use client";

import { useEffect, useState } from "react";
import { getMyReservations } from "@/app/actions/reservations";
import { PocH1, PocMuted } from "@/components/poc-ui";
import { useSupabase } from "@/context/supabase-provider";
import { DUMMY_RENTALS } from "@/lib/dummy-data";
import type { RentalRecord } from "@/lib/domain/types";
import { formatDisplayDate } from "@/lib/format-display-date";
import styles from "./trips.module.css";

export default function TripsPage() {
  const { configured } = useSupabase();
  const [rentals, setRentals] = useState<RentalRecord[]>(() =>
    configured ? [] : DUMMY_RENTALS,
  );

  useEffect(() => {
    if (!configured) return;
    getMyReservations().then(setRentals);
  }, [configured]);

  const upcoming = rentals.filter((r) => r.status === "upcoming");
  const previous = rentals.filter((r) => r.status === "past");

  return (
    <div className={styles.page}>
      <header className={styles.titleBlock}>
        <p className={styles.screenLabel}>Trips</p>
        <PocH1>Your trips</PocH1>
        <PocMuted>Review upcoming reservations and your previous rentals.</PocMuted>
      </header>

      <section className={styles.section} aria-labelledby="trips-upcoming-heading">
        <h2 id="trips-upcoming-heading" className={styles.sectionTitle}>
          Upcoming rentals
        </h2>
        <div className={styles.cardList}>
          {upcoming.length === 0 ? (
            <p className={styles.emptyHint}>No upcoming rentals.</p>
          ) : (
            upcoming.map((r) => (
              <article key={r.id} className={styles.rentalRow}>
                <p className={styles.rentalLocation}>{r.location || "Rental"}</p>
                <p className={styles.meta}>
                  {r.bikeName} · {formatDisplayDate(r.startDate)} → {formatDisplayDate(r.endDate)}
                </p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="trips-previous-heading">
        <h2 id="trips-previous-heading" className={styles.sectionTitle}>
          Previous rentals
        </h2>
        <div className={styles.cardList}>
          {previous.length === 0 ? (
            <p className={styles.emptyHint}>No previous rentals yet.</p>
          ) : (
            previous.map((r) => (
              <article key={r.id} className={styles.rentalRow}>
                <p className={styles.rentalLocation}>{r.location || "Rental"}</p>
                <p className={styles.meta}>
                  {r.bikeName} · {formatDisplayDate(r.startDate)} → {formatDisplayDate(r.endDate)}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
