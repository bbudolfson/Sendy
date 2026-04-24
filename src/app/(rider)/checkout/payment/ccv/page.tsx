"use client";

import { useRouter } from "next/navigation";
import {
  PocButton,
  PocCard,
  PocH1,
  PocInput,
  PocLabel,
  PocMuted,
  PocStack,
} from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";

export default function CheckoutCcvPage() {
  const router = useRouter();
  const { patch } = usePocSession();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Security code</PocH1>
        <PocMuted>CCV is never stored — demo only.</PocMuted>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            patch({ ccvConfirmed: true });
            router.push("/checkout/confirm");
          }}
        >
          <PocStack gap="md">
            <div>
              <PocLabel>CCV</PocLabel>
              <PocInput name="ccv" required minLength={3} maxLength={4} placeholder="123" />
            </div>
            <PocButton type="submit">Review reservation</PocButton>
          </PocStack>
        </form>
      </PocStack>
    </PocCard>
  );
}
