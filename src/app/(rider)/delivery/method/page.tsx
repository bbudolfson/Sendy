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

export default function DeliveryMethodPage() {
  const router = useRouter();
  const { patchDelivery } = usePocSession();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Pickup or delivery</PocH1>
        <PocMuted>This market supports delivery — choose how you want the bike.</PocMuted>
        <PocStack gap="sm">
          <PocButton
            type="button"
            onClick={() => {
              patchDelivery({ mode: "pickup" });
              router.push("/checkout");
            }}
          >
            Pickup
          </PocButton>
          <PocButton
            type="button"
            variant="secondary"
            onClick={() => {
              patchDelivery({ mode: "delivery", addressKnown: null });
              router.push("/delivery/address-check");
            }}
          >
            Delivery
          </PocButton>
        </PocStack>
      </PocStack>
    </PocCard>
  );
}
