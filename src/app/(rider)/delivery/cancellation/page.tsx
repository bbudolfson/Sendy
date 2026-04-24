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

export default function DeliveryCancellationPage() {
  const router = useRouter();
  const { patchDelivery } = usePocSession();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Cancellation policy</PocH1>
        <PocMuted>
          Stub copy: delivery + return pickup may incur fees if cancelled within 48h of the window.
        </PocMuted>
        <PocButton
          type="button"
          onClick={() => {
            patchDelivery({ cancellationAck: true });
            router.push("/checkout");
          }}
        >
          I understand — continue to checkout
        </PocButton>
      </PocStack>
    </PocCard>
  );
}
