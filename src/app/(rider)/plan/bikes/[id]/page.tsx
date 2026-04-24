"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  PocButton,
  PocCard,
  PocH1,
  PocMuted,
  PocStack,
} from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";
import { getAvailabilityForBike, getBikeById, getMarketById } from "@/lib/dummy-data";

export default function BikeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { patch } = usePocSession();
  const id = String(params.id ?? "");
  const bike = getBikeById(id);

  if (!bike) {
    return (
      <PocCard>
        <PocH1>Bike not found</PocH1>
        <Link href="/plan/bikes">Back</Link>
      </PocCard>
    );
  }

  const market = getMarketById(bike.marketId);
  const availability = getAvailabilityForBike(bike.id, new Date());

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>{bike.name}</PocH1>
        <PocMuted>
          {market?.label} · {bike.brand} {bike.model} · Size {bike.size} · ${bike.dailyPrice}/day
        </PocMuted>
        <div>
          <p style={{ fontSize: "0.8125rem", fontWeight: 600, marginBottom: 8 }}>Availability (dummy 14 days)</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(4.5rem, 1fr))",
              gap: 6,
            }}
          >
            {availability.map((d) => (
              <span
                key={d.date}
                title={d.date}
                style={{
                  fontSize: "0.65rem",
                  padding: "4px 2px",
                  textAlign: "center",
                  border: "1px solid var(--color-border)",
                  borderRadius: 4,
                  background: d.available ? "var(--color-surface)" : "var(--color-bg)",
                  color: d.available ? "var(--color-text)" : "var(--color-text-subtle)",
                }}
              >
                {d.date.slice(5)}
              </span>
            ))}
          </div>
        </div>
        <PocButton
          type="button"
          onClick={() => {
            patch({ bikeId: bike.id, marketId: bike.marketId });
            router.push("/plan/reserve");
          }}
        >
          Reserve
        </PocButton>
        <Link href="/plan/bikes" style={{ fontSize: "0.875rem" }}>
          ← Back to matches
        </Link>
      </PocStack>
    </PocCard>
  );
}
