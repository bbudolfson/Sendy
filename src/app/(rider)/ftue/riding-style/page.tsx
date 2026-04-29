"use client";

import { useRouter } from "next/navigation";
import {
  PocButton,
  PocCard,
  PocH1,
  PocLabel,
  PocMuted,
  PocSelect,
  PocStack,
} from "@/components/poc-ui";

export default function FtueRidingStylePage() {
  const router = useRouter();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Riding style</PocH1>
        <PocMuted>
          Step 3 of 3 — always shown per spec.
        </PocMuted>
        <div>
          <PocLabel>Experience</PocLabel>
          <PocSelect defaultValue="Intermediate">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Expert</option>
          </PocSelect>
        </div>
        <div>
          <PocLabel>Terrain</PocLabel>
          <PocSelect defaultValue="Mixed">
            <option>Road</option>
            <option>Mountain</option>
            <option>Gravel</option>
            <option>Mixed</option>
          </PocSelect>
        </div>
        <div>
          <PocLabel>Aggressiveness</PocLabel>
          <PocSelect defaultValue="Moderate">
            <option>Chill</option>
            <option>Moderate</option>
            <option>Aggressive</option>
          </PocSelect>
        </div>
        <PocButton type="button" onClick={() => router.push("/rider-profile")}>
          Review profile
        </PocButton>
      </PocStack>
    </PocCard>
  );
}
