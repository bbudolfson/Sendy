"use client";

import { useRouter } from "next/navigation";
import {
  PocButton,
  PocCard,
  PocH1,
  PocMuted,
  PocStack,
} from "@/components/poc-ui";

export default function DeliveryDisclaimPage() {
  const router = useRouter();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Address later</PocH1>
        <PocMuted>
          You can update your delivery address before the trip. Available windows may change when you
          do.
        </PocMuted>
        <PocButton type="button" onClick={() => router.push("/delivery/window")}>
          Continue
        </PocButton>
      </PocStack>
    </PocCard>
  );
}
