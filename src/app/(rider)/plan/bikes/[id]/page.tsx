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
import { formatDisplayDate } from "@/lib/format-display-date";
import styles from "./bike-detail.module.css";

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
        <Link href="/dashboard">Back</Link>
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
        <img
          src={bike.imageUrl}
          alt={`${bike.name} photo`}
          className={styles.heroImage}
        />
        <div>
          <p className={styles.availabilityTitle}>Availability (dummy 14 days)</p>
          <div className={styles.availabilityGrid}>
            {availability.map((d) => (
              <span
                key={d.date}
                title={formatDisplayDate(d.date)}
                className={`${styles.availabilityCell} ${d.available ? styles.available : styles.unavailable}`}
              >
                {formatDisplayDate(d.date)}
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
        <Link href="/dashboard" className={styles.backLink}>
          ← Back to search
        </Link>
      </PocStack>
    </PocCard>
  );
}
