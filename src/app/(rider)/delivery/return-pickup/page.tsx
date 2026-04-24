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
import { RETURN_PICKUP_FEE } from "@/lib/dummy-data";

export default function ReturnPickupPage() {
  const router = useRouter();
  const { patchDelivery } = usePocSession();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Return pickup</PocH1>
        <PocMuted>Want us to pick the bike up at the end of your trip? Extra fee applies.</PocMuted>
        <PocStack gap="sm">
          <PocButton
            type="button"
            onClick={() => {
              patchDelivery({ returnPickup: false, returnPickupPriceConfirmed: false, cancellationAck: false });
              router.push("/checkout");
            }}
          >
            No — one-way delivery only
          </PocButton>
          <PocButton
            type="button"
            variant="secondary"
            onClick={() => {
              patchDelivery({ returnPickup: true });
              router.push("/delivery/pickup-price");
            }}
          >
            Yes — add return pickup (${RETURN_PICKUP_FEE})
          </PocButton>
        </PocStack>
      </PocStack>
    </PocCard>
  );
}
