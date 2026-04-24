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
import { TRIP_TYPES } from "@/lib/dummy-data";
import type { TripType } from "@/lib/domain/types";

export default function BrowseTripTypesPage() {
  const router = useRouter();
  const { patch } = usePocSession();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Browse trip types</PocH1>
        <PocMuted>You don’t know where yet — pick a vibe first.</PocMuted>
        <PocStack gap="sm">
          {TRIP_TYPES.map((t) => (
            <PocButton
              key={t}
              type="button"
              variant="secondary"
              onClick={() => {
                patch({ selectedTripType: t as TripType });
                router.push("/plan/select-market");
              }}
            >
              {t}
            </PocButton>
          ))}
        </PocStack>
      </PocStack>
    </PocCard>
  );
}
