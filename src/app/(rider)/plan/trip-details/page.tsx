"use client";

import { useRouter } from "next/navigation";
import {
  PocButton,
  PocCard,
  PocH1,
  PocInput,
  PocLabel,
  PocMuted,
  PocStack,
} from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";
import { resolveMarketFromLocation } from "@/lib/dummy-data";
import styles from "../plan-shared.module.css";

export default function TripDetailsPage() {
  const router = useRouter();
  const { patch, session } = usePocSession();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Trip details</PocH1>
        <PocMuted>Location required. Dates and # riders optional.</PocMuted>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const location = String(fd.get("location") ?? "");
            const start = String(fd.get("start") ?? "").trim() || null;
            const end = String(fd.get("end") ?? "").trim() || null;
            const ridersRaw = String(fd.get("riders") ?? "").trim();
            const riderCountParsed = ridersRaw ? Number(ridersRaw) : NaN;
            const riderCount = Number.isFinite(riderCountParsed) ? riderCountParsed : null;

            const { exists, market } = resolveMarketFromLocation(location);
            patch({
              tripLocation: location,
              tripStart: start,
              tripEnd: end,
              riderCount: Number.isFinite(riderCount as number) ? riderCount : null,
              marketId: market?.id ?? null,
              datesKnown: !!(start && end),
            });

            if (!exists) {
              router.push("/plan/request-market");
              return;
            }
            if (start && end) {
              router.push("/plan/bikes");
            } else {
              router.push("/plan/dates");
            }
          }}
        >
          <PocStack gap="md">
            <div>
              <PocLabel>Location</PocLabel>
              <PocInput
                name="location"
                required
                placeholder="e.g. Moab, UT or Bend, OR"
                defaultValue={session.tripLocation}
              />
            </div>
            <div>
              <PocLabel>Dates (optional)</PocLabel>
              <PocInput name="start" type="date" defaultValue={session.tripStart ?? ""} />
              <PocInput
                name="end"
                type="date"
                defaultValue={session.tripEnd ?? ""}
                className={styles.spacedInput}
              />
            </div>
            <div>
              <PocLabel># Riders (optional)</PocLabel>
              <PocInput
                name="riders"
                type="number"
                min={1}
                placeholder="2"
                defaultValue={session.riderCount ?? ""}
              />
            </div>
            <PocButton type="submit">Continue</PocButton>
          </PocStack>
        </form>
      </PocStack>
    </PocCard>
  );
}
