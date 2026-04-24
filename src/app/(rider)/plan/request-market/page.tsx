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

export default function RequestMarketPage() {
  const router = useRouter();
  const { session } = usePocSession();

  return (
    <PocCard>
      <PocStack gap="md">
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
        <PocButton type="button" onClick={() => router.push("/plan/trip-details")}>
          Submit (demo) → back to trip details
        </PocButton>
      </PocStack>
    </PocCard>
  );
}
