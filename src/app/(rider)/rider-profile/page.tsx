"use client";

import { useRouter } from "next/navigation";
import { PocButton, PocCard, PocH1, PocMuted, PocStack } from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";

export default function RiderProfileReviewPage() {
  const router = useRouter();
  const { patch } = usePocSession();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Rider profile</PocH1>
        <PocMuted>Generated summary from FTUE inputs (dummy content).</PocMuted>
        <ul style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "var(--color-text-muted)" }}>
          <li>Rider: Alex Rider</li>
          <li>Height / weight on file</li>
          <li>Home bike: Specialized Stumpjumper (L)</li>
          <li>Style: Intermediate · Mixed · Moderate</li>
        </ul>
        <PocButton
          type="button"
          onClick={() => {
            patch({ hasCompletedFtue: true });
            router.push("/dashboard");
          }}
        >
          Save and go to dashboard
        </PocButton>
      </PocStack>
    </PocCard>
  );
}
