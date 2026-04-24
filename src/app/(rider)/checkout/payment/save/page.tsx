"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PocCard, PocMuted, PocStack } from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";

export default function CheckoutPaymentSavePage() {
  const router = useRouter();
  const { patch } = usePocSession();

  useEffect(() => {
    patch({ hasSavedPaymentMethod: true, hasEnteredNewCard: true });
    const t = setTimeout(() => router.replace("/checkout/payment/confirm"), 400);
    return () => clearTimeout(t);
  }, [patch, router]);

  return (
    <PocCard>
      <PocStack gap="md">
        <PocMuted>Saving card (demo)…</PocMuted>
      </PocStack>
    </PocCard>
  );
}
