"use client";

import { useRouter } from "next/navigation";
import {
  PocButton,
  PocCard,
  PocH1,
  PocInput,
  PocLabel,
  PocStack,
} from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";

export default function DeliveryAddressPage() {
  const router = useRouter();
  const { patchDelivery, session } = usePocSession();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Enter delivery address</PocH1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            patchDelivery({ address: String(fd.get("line1") ?? "") });
            router.push("/delivery/location-type");
          }}
        >
          <PocStack gap="md">
            <div>
              <PocLabel>Street, city, ZIP</PocLabel>
              <PocInput name="line1" required placeholder="123 Main St, Moab, UT" defaultValue={session.delivery.address} />
            </div>
            <PocButton type="submit">Continue</PocButton>
          </PocStack>
        </form>
      </PocStack>
    </PocCard>
  );
}
