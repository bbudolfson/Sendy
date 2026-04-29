"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  PocButton,
  PocCard,
  PocH1,
  PocMuted,
  PocStack,
} from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";
import { getBikeById, getMarketById, RETURN_PICKUP_FEE } from "@/lib/dummy-data";
import styles from "../checkout.module.css";

export default function CheckoutConfirmReservationPage() {
  const router = useRouter();
  const { session, patch } = usePocSession();

  useEffect(() => {
    if (!session.ccvConfirmed) {
      router.replace("/checkout/payment/ccv");
    }
  }, [session.ccvConfirmed, router]);
  const bike = session.bikeId ? getBikeById(session.bikeId) : undefined;
  const market = session.marketId ? getMarketById(session.marketId) : undefined;

  const days =
    session.tripStart && session.tripEnd
      ? Math.max(
          1,
          Math.ceil(
            (new Date(session.tripEnd).getTime() - new Date(session.tripStart).getTime()) /
              (86400 * 1000),
          ) + 1,
        )
      : 3;
  const bikeTotal = (bike?.dailyPrice ?? 0) * days;
  const pickupFee =
    session.delivery.mode === "delivery" && session.delivery.returnPickup ? RETURN_PICKUP_FEE : 0;

  if (!session.ccvConfirmed) {
    return (
      <PocCard>
        <PocMuted>Redirecting to CCV…</PocMuted>
      </PocCard>
    );
  }

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Confirm reservation</PocH1>
        <PocMuted>Final destructive step in prod — here it only flips demo state.</PocMuted>
        <ul className={styles.summaryList}>
          <li>Bike: {bike?.name}</li>
          <li>Market: {market?.label}</li>
          <li>Dates: {session.tripStart} → {session.tripEnd}</li>
          <li>Delivery mode: {session.delivery.mode ?? "n/a"}</li>
          <li>Est. bike subtotal: ${bikeTotal}</li>
          {pickupFee > 0 && <li>Return pickup: ${pickupFee}</li>}
        </ul>
        <PocButton
          type="button"
          onClick={() => {
            patch({ checkoutConfirmed: true });
            router.push("/checkout/success");
          }}
        >
          Pay and confirm
        </PocButton>
      </PocStack>
    </PocCard>
  );
}
