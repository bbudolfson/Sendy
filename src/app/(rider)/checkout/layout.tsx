"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { canEnterCheckout, usePocSession } from "@/context/poc-session";
import { PocCard, PocMuted, PocStack } from "@/components/poc-ui";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  const { session } = usePocSession();
  const router = useRouter();

  useEffect(() => {
    if (!canEnterCheckout(session)) {
      router.replace("/plan/accept");
    }
  }, [session, router]);

  if (!canEnterCheckout(session)) {
    return (
      <PocCard>
        <PocStack gap="md">
          <PocMuted>No active reservation for checkout. Send you back to accept…</PocMuted>
        </PocStack>
      </PocCard>
    );
  }

  return <>{children}</>;
}
