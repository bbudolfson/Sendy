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

export default function DeliveryAddressCheckPage() {
  const router = useRouter();
  const { patchDelivery } = usePocSession();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Delivery address</PocH1>
        <PocMuted>Do you already know where you’ll be staying?</PocMuted>
        <PocStack gap="sm">
          <PocButton
            type="button"
            onClick={() => {
              patchDelivery({ addressKnown: true });
              router.push("/delivery/address");
            }}
          >
            Yes — enter address
          </PocButton>
          <PocButton
            type="button"
            variant="secondary"
            onClick={() => {
              patchDelivery({ addressKnown: false, address: "" });
              router.push("/delivery/disclaim");
            }}
          >
            Not yet
          </PocButton>
        </PocStack>
      </PocStack>
    </PocCard>
  );
}
