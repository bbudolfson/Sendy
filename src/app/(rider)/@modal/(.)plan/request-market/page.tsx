"use client";

import { useRouter } from "next/navigation";
import {
  PocButton,
  PocCard,
  PocH1,
  PocInput,
  PocLabel,
  PocMuted,
  PocSelect,
  PocStack,
} from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";
import { TRIP_TYPES } from "@/lib/dummy-data";
import styles from "./request-market-modal.module.css";

export default function RequestMarketModalPage() {
  const router = useRouter();
  const { session } = usePocSession();

  const closeModal = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div
      className={styles.backdrop}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <div className={styles.panel}>
        <PocCard>
          <PocStack gap="md">
            <div className={styles.topRow}>
              <button
                type="button"
                className={styles.close}
                aria-label="Close market request modal"
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            <PocH1>Request this market</PocH1>
            <PocMuted>No coverage yet for your destination. Submit interest (demo only).</PocMuted>
            <div>
              <PocLabel>Destination</PocLabel>
              <PocInput readOnly value={session.tripLocation || "Unknown"} />
            </div>
            <div>
              <PocLabel>Trip type</PocLabel>
              <PocSelect name="tripType" defaultValue="Mountain">
                {TRIP_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </PocSelect>
            </div>
            <div>
              <PocLabel>Email for updates</PocLabel>
              <PocInput type="email" placeholder="you@example.com" />
            </div>
            <PocButton type="button" onClick={closeModal}>
              Submit (demo)
            </PocButton>
          </PocStack>
        </PocCard>
      </div>
    </div>
  );
}
