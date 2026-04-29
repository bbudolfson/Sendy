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

export default function PlanDatesPage() {
  const router = useRouter();
  const { patch, session } = usePocSession();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Trip dates</PocH1>
        <PocMuted>Required when dates weren’t set on trip details.</PocMuted>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const start = String(fd.get("start") ?? "");
            const end = String(fd.get("end") ?? "");
            patch({ tripStart: start, tripEnd: end, datesKnown: true });
            router.push("/dashboard");
          }}
        >
          <PocStack gap="md">
            <div>
              <PocLabel>Start</PocLabel>
              <PocInput name="start" type="date" required defaultValue={session.tripStart ?? ""} />
            </div>
            <div>
              <PocLabel>End</PocLabel>
              <PocInput name="end" type="date" required defaultValue={session.tripEnd ?? ""} />
            </div>
            <PocButton type="submit">View bike matches</PocButton>
          </PocStack>
        </form>
      </PocStack>
    </PocCard>
  );
}
