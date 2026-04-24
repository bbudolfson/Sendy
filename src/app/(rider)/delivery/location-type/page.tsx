"use client";

import { useRouter } from "next/navigation";
import {
  PocButton,
  PocCard,
  PocH1,
  PocLabel,
  PocSelect,
  PocStack,
} from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";
import { LOCATION_TYPES } from "@/lib/dummy-data";

export default function DeliveryLocationTypePage() {
  const router = useRouter();
  const { patchDelivery } = usePocSession();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Location type</PocH1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            patchDelivery({ locationType: String(fd.get("type") ?? "") });
            router.push("/delivery/window");
          }}
        >
          <PocStack gap="md">
            <div>
              <PocLabel>What kind of place is this?</PocLabel>
              <PocSelect name="type" required defaultValue="Hotel">
                {LOCATION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </PocSelect>
            </div>
            <PocButton type="submit">Continue</PocButton>
          </PocStack>
        </form>
      </PocStack>
    </PocCard>
  );
}
