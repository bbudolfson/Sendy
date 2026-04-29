"use client";

import { PocCard, PocH1, PocMuted, PocStack } from "@/components/poc-ui";
import { DUMMY_RENTALS } from "@/lib/dummy-data";
import { formatDisplayDate } from "@/lib/format-display-date";
import styles from "./trips.module.css";

export default function TripsPage() {
  const upcoming = DUMMY_RENTALS.filter((r) => r.status === "upcoming");
  const previous = DUMMY_RENTALS.filter((r) => r.status === "past");

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <p className={styles.screenLabel}>Trips</p>
      </div>

      <PocCard>
        <PocStack gap="sm">
          <PocH1>Your trips</PocH1>
          <PocMuted>Review upcoming reservations and your previous rentals.</PocMuted>
        </PocStack>
      </PocCard>

      <PocCard>
        <PocStack gap="sm">
          <h2 className={styles.sectionTitle}>Upcoming rentals</h2>
          {upcoming.map((r) => (
            <article key={r.id} className={styles.rentalRow}>
              <p>{r.location}</p>
              <p className={styles.meta}>
                {r.bikeName} · {formatDisplayDate(r.startDate)} → {formatDisplayDate(r.endDate)}
              </p>
            </article>
          ))}
        </PocStack>
      </PocCard>

      <PocCard>
        <PocStack gap="sm">
          <h2 className={styles.sectionTitle}>Previous rentals</h2>
          {previous.map((r) => (
            <article key={r.id} className={styles.rentalRow}>
              <p>{r.location}</p>
              <p className={styles.meta}>
                {r.bikeName} · {formatDisplayDate(r.startDate)} → {formatDisplayDate(r.endDate)}
              </p>
            </article>
          ))}
        </PocStack>
      </PocCard>
    </div>
  );
}
