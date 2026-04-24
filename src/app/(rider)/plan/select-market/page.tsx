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
import { getMarketsForTripType, MARKETS } from "@/lib/dummy-data";
import type { TripType } from "@/lib/domain/types";

export default function SelectMarketPage() {
  const router = useRouter();
  const { patch, session } = usePocSession();
  const tripType = (session.selectedTripType as TripType) || "Gravel";
  const markets =
    session.selectedTripType != null
      ? getMarketsForTripType(tripType)
      : MARKETS;

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Select a market</PocH1>
        <PocMuted>Dummy list filtered by trip type when set from browse.</PocMuted>
        <PocStack gap="sm">
          {markets.map((m) => (
            <PocButton
              key={m.id}
              type="button"
              variant="secondary"
              onClick={() => {
                patch({
                  marketId: m.id,
                  tripLocation: m.label,
                  selectedTripType: tripType,
                });
                router.push(session.datesKnown ? "/plan/bikes" : "/plan/dates");
              }}
            >
              {m.label}
            </PocButton>
          ))}
        </PocStack>
        <PocButton type="button" variant="ghost" onClick={() => router.push("/plan/dates")}>
          Skip dates check → dates screen
        </PocButton>
      </PocStack>
    </PocCard>
  );
}
