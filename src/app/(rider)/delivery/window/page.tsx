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
import { DELIVERY_WINDOWS } from "@/lib/dummy-data";

export default function DeliveryWindowPage() {
  const router = useRouter();
  const { patchDelivery } = usePocSession();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Delivery window</PocH1>
        <PocMuted>Dummy slots for the selected trip dates.</PocMuted>
        <PocStack gap="sm">
          {DELIVERY_WINDOWS.map((w) => (
            <PocButton
              key={w.id}
              type="button"
              variant="secondary"
              onClick={() => {
                patchDelivery({ windowId: w.id });
                router.push("/delivery/return-pickup");
              }}
            >
              {w.label}
            </PocButton>
          ))}
        </PocStack>
      </PocStack>
    </PocCard>
  );
}
