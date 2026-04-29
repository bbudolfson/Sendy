"use client";

import { useRouter } from "next/navigation";
import {
  PocButton,
  PocCard,
  PocH1,
  PocMuted,
  PocStack,
} from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";
import { getBikeById, getMarketById } from "@/lib/dummy-data";
import styles from "../plan-shared.module.css";

export default function AcceptPage() {
  const router = useRouter();
  const { patch, session } = usePocSession();
  const bike = session.bikeId ? getBikeById(session.bikeId) : undefined;
  const market = session.marketId ? getMarketById(session.marketId) : undefined;

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Review booking</PocH1>
        <PocMuted>Summary before delivery vs checkout branch (system decides delivery).</PocMuted>
        <ul className={styles.summaryList}>
          <li>Bike: {bike?.name ?? "—"}</li>
          <li>Market: {market?.label ?? "—"}</li>
          <li>Dates: {session.tripStart ?? "—"} → {session.tripEnd ?? "—"}</li>
          <li>Add-ons: {JSON.stringify(session.addOns)}</li>
        </ul>
        <PocButton
          type="button"
          onClick={() => {
            patch({ accepted: true });
            if (!market?.deliveryAvailable) {
              router.push("/plan/pickup-only");
            } else {
              router.push("/delivery/method");
            }
          }}
        >
          Accept
        </PocButton>
      </PocStack>
    </PocCard>
  );
}
