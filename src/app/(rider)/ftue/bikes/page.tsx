"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  PocButton,
  PocCard,
  PocH1,
  PocInput,
  PocLabel,
  PocSelect,
  PocStack,
} from "@/components/poc-ui";

export default function FtueBikesPage() {
  const router = useRouter();
  const [ownsBike, setOwnsBike] = useState<"yes" | "no" | null>(null);

  if (ownsBike === null) {
    return (
      <PocCard>
        <PocStack gap="md">
          <PocH1>Own a bike?</PocH1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            Step 2 of 3 — optional bike details loop for matching.
          </p>
          <PocButton type="button" onClick={() => setOwnsBike("yes")}>
            Yes
          </PocButton>
          <PocButton type="button" variant="secondary" onClick={() => router.push("/ftue/riding-style")}>
            No — skip to riding style
          </PocButton>
        </PocStack>
      </PocCard>
    );
  }

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Bike details</PocH1>
        <div>
          <PocLabel>Brand</PocLabel>
          <PocInput placeholder="Specialized" />
        </div>
        <div>
          <PocLabel>Type</PocLabel>
          <PocSelect defaultValue="Mountain">
            <option>Road</option>
            <option>Mountain</option>
            <option>Gravel</option>
            <option>E-Bike</option>
          </PocSelect>
        </div>
        <div>
          <PocLabel>Model</PocLabel>
          <PocInput placeholder="Stumpjumper" />
        </div>
        <div>
          <PocLabel>Size</PocLabel>
          <PocInput placeholder="L" />
        </div>
        <PocStack gap="sm">
          <PocButton type="button" onClick={() => router.push("/ftue/bikes")}>
            Add another bike (loop demo)
          </PocButton>
          <PocButton type="button" variant="secondary" onClick={() => router.push("/ftue/riding-style")}>
            Done with bikes
          </PocButton>
        </PocStack>
      </PocStack>
    </PocCard>
  );
}
