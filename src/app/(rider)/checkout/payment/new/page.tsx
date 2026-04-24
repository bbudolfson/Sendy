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

export default function CheckoutPaymentNewPage() {
  const router = useRouter();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Payment details</PocH1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/checkout/payment/save");
          }}
        >
          <PocStack gap="md">
            <div>
              <PocLabel>Card number</PocLabel>
              <PocInput placeholder="4242 4242 4242 4242" required />
            </div>
            <div>
              <PocLabel>Expiry</PocLabel>
              <PocInput placeholder="12 / 28" required />
            </div>
            <PocButton type="submit">Save card</PocButton>
          </PocStack>
        </form>
      </PocStack>
    </PocCard>
  );
}
