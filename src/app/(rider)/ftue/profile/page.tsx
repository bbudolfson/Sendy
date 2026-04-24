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

export default function FtueProfilePage() {
  const router = useRouter();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Your profile</PocH1>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
          Step 1 of 3 — name, height, weight (single screen per spec).
        </p>
        <div>
          <PocLabel>Name</PocLabel>
          <PocInput required placeholder="Alex Rider" />
        </div>
        <div>
          <PocLabel>Height</PocLabel>
              <PocInput required placeholder="178 cm or inches" />
        </div>
        <div>
          <PocLabel>Weight</PocLabel>
          <PocInput required placeholder="165 lb" />
        </div>
        <PocButton type="button" onClick={() => router.push("/ftue/bikes")}>
          Continue
        </PocButton>
      </PocStack>
    </PocCard>
  );
}
