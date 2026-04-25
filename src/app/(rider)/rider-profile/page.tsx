"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PocButton, PocCard, PocH1, PocInput, PocLabel, PocMuted, PocSelect, PocStack } from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";
import { DUMMY_RENTALS } from "@/lib/dummy-data";
import styles from "./rider-profile.module.css";

export default function RiderProfileReviewPage() {
  const router = useRouter();
  const { patch, resetAll } = usePocSession();
  const [saved, setSaved] = useState(false);
  const upcoming = DUMMY_RENTALS.filter((r) => r.status === "upcoming");
  const previous = DUMMY_RENTALS.filter((r) => r.status === "past");

  return (
    <div className={styles.page}>
      <PocCard>
        <PocStack gap="md">
          <PocH1>Rider profile</PocH1>
          <PocMuted>Edit your fit and preferences, then review rentals below.</PocMuted>
          <div className={styles.formGrid}>
            <div>
              <PocLabel>Name</PocLabel>
              <PocInput defaultValue="Alex Rider" />
            </div>
            <div>
              <PocLabel>Height</PocLabel>
              <PocInput defaultValue="178 cm" />
            </div>
            <div>
              <PocLabel>Weight</PocLabel>
              <PocInput defaultValue="165 lb" />
            </div>
            <div>
              <PocLabel>Primary bike type</PocLabel>
              <PocSelect defaultValue="Mountain">
                <option>Mountain</option>
                <option>Gravel</option>
                <option>Road</option>
                <option>E-Bike</option>
              </PocSelect>
            </div>
          </div>
          <div className={styles.actions}>
            <PocButton
              type="button"
              onClick={() => {
                patch({ hasCompletedFtue: true });
                setSaved(true);
              }}
            >
              Save profile
            </PocButton>
            <PocButton type="button" variant="secondary" onClick={() => router.push("/dashboard")}>
              Back to dashboard
            </PocButton>
            <PocButton
              type="button"
              variant="ghost"
              onClick={() => {
                resetAll();
                router.push("/sign-in");
              }}
            >
              Log out
            </PocButton>
          </div>
          {saved ? <p className={styles.saved}>Profile updated.</p> : null}
        </PocStack>
      </PocCard>

      <PocCard>
        <PocStack gap="sm">
          <h2 className={styles.sectionTitle}>Upcoming rentals</h2>
          {upcoming.map((r) => (
            <article key={r.id} className={styles.rentalRow}>
              <p>{r.location}</p>
              <p className={styles.meta}>
                {r.bikeName} · {r.startDate} → {r.endDate}
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
                {r.bikeName} · {r.startDate} → {r.endDate}
              </p>
            </article>
          ))}
        </PocStack>
      </PocCard>
    </div>
  );
}
