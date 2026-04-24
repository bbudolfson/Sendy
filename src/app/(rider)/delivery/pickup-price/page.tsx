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

export default function PickupPricePage() {
  const router = useRouter();
  const { patchDelivery } = usePocSession();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Confirm return pickup price</PocH1>
        <PocMuted>Additional ${RETURN_PICKUP_FEE} will be added to your reservation.</PocMuted>
        <PocButton
          type="button"
          onClick={() => {
            patchDelivery({ returnPickupPriceConfirmed: true });
            router.push("/delivery/cancellation");
          }}
        >
          Confirm price
        </PocButton>
      </PocStack>
    </PocCard>
  );
}
