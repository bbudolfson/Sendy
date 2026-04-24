"use client";

import {
  PocButtonLink,
  PocCard,
  PocH1,
  PocMuted,
  PocStack,
} from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";

export default function DashboardPage() {
  const { session } = usePocSession();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Dashboard</PocH1>
        <PocMuted>
          {session.hasCompletedFtue
            ? "You’re set up. Start a trip to exercise dummy inventory."
            : "Finish FTUE from sign-in if you want the full onboarding path."}
        </PocMuted>
        <PocStack gap="sm">
          <PocButtonLink href="/plan/trip-details">Plan a trip</PocButtonLink>
          <PocButtonLink href="/plan/browse" variant="secondary">
            Browse trip types
          </PocButtonLink>
        </PocStack>
      </PocStack>
    </PocCard>
  );
}
