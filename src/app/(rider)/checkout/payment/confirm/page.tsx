"use client";

import { useRouter } from "next/navigation";
import {
  PocButton,
  PocButtonLink,
  PocCard,
  PocH1,
  PocMuted,
  PocStack,
} from "@/components/poc-ui";

export default function CheckoutPaymentConfirmPage() {
  const router = useRouter();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Saved card</PocH1>
        <PocMuted>Visa •••• 4242</PocMuted>
        <PocStack gap="sm">
          <PocButton type="button" onClick={() => router.push("/checkout/payment/ccv")}>
            Continue — enter CCV
          </PocButton>
          <PocButtonLink href="/dashboard" variant="ghost">
            Cancel
          </PocButtonLink>
        </PocStack>
      </PocStack>
    </PocCard>
  );
}
