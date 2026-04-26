"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PocButton, PocCard, PocH1, PocH2, PocInput, PocLabel, PocMuted, PocSelect, PocStack } from "@/components/poc-ui";
import { StravaConnectSection } from "@/components/strava-connect-section";
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
            <div>
              <PocLabel>Riding skill level</PocLabel>
              <PocSelect defaultValue="Intermediate">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Expert</option>
              </PocSelect>
            </div>
            <div>
              <PocLabel>Preferred terrain</PocLabel>
              <PocSelect defaultValue="Mixed">
                <option>Road</option>
                <option>Mountain</option>
                <option>Gravel</option>
                <option>Mixed</option>
              </PocSelect>
            </div>
            <div>
              <PocLabel>Riding aggressiveness</PocLabel>
              <PocSelect defaultValue="Moderate">
                <option>Chill</option>
                <option>Moderate</option>
                <option>Aggressive</option>
              </PocSelect>
            </div>
            <div>
              <PocLabel>Primary riding location</PocLabel>
              <PocInput defaultValue="Boulder, CO" placeholder="City, State or Region" />
            </div>
            <div className={styles.fullRow}>
              <PocLabel>Profile photo</PocLabel>
              <PocInput type="file" accept="image/*" />
              <p className={styles.hint}>Upload a clear photo for your rider profile.</p>
            </div>
            <div className={styles.fullRow}>
              <PocH2>Connected services</PocH2>
              <StravaConnectSection />
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
