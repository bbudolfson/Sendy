"use client";

import {
  PocButtonLink,
  PocCard,
  PocH1,
  PocMuted,
  PocStack,
} from "@/components/poc-ui";

export default function CheckoutSuccessPage() {
  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>You’re booked</PocH1>
        <PocMuted>Confirmation #DEMO-9281 · Email stub would fire here.</PocMuted>
        <PocButtonLink href="/dashboard">Back to dashboard</PocButtonLink>
      </PocStack>
    </PocCard>
  );
}
