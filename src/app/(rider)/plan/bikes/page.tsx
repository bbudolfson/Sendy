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
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {withFallback.map((b) => (
            <li
              key={b.id}
              style={{
                padding: "var(--space-3) 0",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <Link href={`/plan/bikes/${b.id}`} style={{ fontWeight: 600 }}>
                {b.name}
              </Link>
              <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginTop: 4 }}>
                {b.brand} · {b.type} · {b.size} · ${b.dailyPrice}/day ·{" "}
                {b.matchTier === "good" ? "Strong match" : "Other bike"}
              </p>
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
