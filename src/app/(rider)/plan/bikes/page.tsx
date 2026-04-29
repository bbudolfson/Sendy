"use client";

import Link from "next/link";
import {
  PocButton,
  PocCard,
  PocH1,
  PocMuted,
  PocStack,
} from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";
import { getBikesForMarket, getMarketById } from "@/lib/dummy-data";
import styles from "./bikes.module.css";

export default function PlanBikesPage() {
  const { session, patch } = usePocSession();

  if (!session.marketId) {
    return (
      <PocCard>
        <PocStack gap="md">
          <PocH1>Bike matches</PocH1>
          <PocMuted>No market in session. Start from trip details or browse.</PocMuted>
          <Link href="/plan/trip-details">Go to trip details</Link>
        </PocStack>
      </PocCard>
    );
  }

  const market = getMarketById(session.marketId);
  const primary = getBikesForMarket(session.marketId, { includeFallback: false });
  const withFallback = session.useFallbackBikes
    ? getBikesForMarket(session.marketId, { includeFallback: true })
    : primary;

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Bike matches</PocH1>
        <PocMuted>
          {market?.label} · {session.useFallbackBikes ? "Including other bikes" : "Good matches only"}
        </PocMuted>
        <ul className={styles.list}>
          {withFallback.map((b) => (
            <li key={b.id} className={styles.item}>
              <img
                src={b.imageUrl}
                alt={`${b.name} photo`}
                className={styles.image}
              />
              <div>
                <Link href={`/plan/bikes/${b.id}`} className={styles.bikeLink}>
                  {b.name}
                </Link>
                <p className={styles.bikeMeta}>
                  {b.brand} · {b.type} · {b.size} · ${b.dailyPrice}/day ·{" "}
                  {b.matchTier === "good" ? "Strong match" : "Other bike"}
                </p>
              </div>
            </li>
          ))}
        </ul>
        {!session.useFallbackBikes && primary.length > 0 && (
          <PocButton type="button" variant="secondary" onClick={() => patch({ useFallbackBikes: true })}>
            Show other bikes
          </PocButton>
        )}
      </PocStack>
    </PocCard>
  );
}
