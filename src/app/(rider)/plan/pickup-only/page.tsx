"use client";

import { useRouter } from "next/navigation";
import {
  PocButton,
  PocCard,
  PocH1,
  PocMuted,
  PocStack,
} from "@/components/poc-ui";

export default function PickupOnlyPage() {
  const router = useRouter();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Pickup only in this market</PocH1>
        <PocMuted>
          Delivery is not available here. You’ll pick up the bike from the local hub before your ride.
        </PocMuted>
        <PocButton type="button" onClick={() => router.push("/checkout")}>
          Continue to checkout
        </PocButton>
      </PocStack>
    </PocCard>
  );
}
