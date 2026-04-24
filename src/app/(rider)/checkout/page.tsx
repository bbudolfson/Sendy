"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePocSession } from "@/context/poc-session";

export default function CheckoutIndexPage() {
  const router = useRouter();
  const { session } = usePocSession();

  useEffect(() => {
    if (!session.hasSavedPaymentMethod) {
      router.replace("/checkout/payment/new");
    } else {
      router.replace("/checkout/payment/confirm");
    }
  }, [router, session.hasSavedPaymentMethod]);

  return null;
}
