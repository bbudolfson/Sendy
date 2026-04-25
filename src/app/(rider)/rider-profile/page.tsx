"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PocButton, PocCard, PocH1, PocInput, PocLabel, PocMuted, PocSelect, PocStack } from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";
import styles from "./rider-profile.module.css";

export default function RiderProfileReviewPage() {
  const router = useRouter();
  const { patch, resetAll } = usePocSession();
  const [saved, setSaved] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <p className={styles.screenLabel}>Profile</p>
        <a href="/dashboard" className={styles.closeButton} aria-label="Close profile">
          ×
        </a>
      </div>
      <PocCard>
        <PocStack gap="md">
          <PocH1>Rider profile</PocH1>
          <PocMuted>Edit your fit and riding preferences.</PocMuted>
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
          {saved ? <p className={styles.saved}>Profile updated.</p> : null}
        </PocStack>
      </PocCard>
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
    </div>
  );
}
