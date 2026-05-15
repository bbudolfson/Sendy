"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBikeById as getBikeByIdRemote } from "@/app/actions/bikes";
import { createReservation } from "@/app/actions/reservations";
import {
  PocButton,
  PocCard,
  PocH1,
  PocMuted,
  PocStack,
} from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";
import { useSupabase } from "@/context/supabase-provider";
import { getBikeById, getMarketById, RETURN_PICKUP_FEE } from "@/lib/dummy-data";
import { formatDisplayDate, parseIsoDateOnlyLocal } from "@/lib/format-display-date";
import styles from "../checkout.module.css";

export default function CheckoutConfirmReservationPage() {
  const router = useRouter();
  const { configured } = useSupabase();
  const { session, patch } = usePocSession();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [remoteDailyRate, setRemoteDailyRate] = useState<number | null>(null);
  const [remoteBikeTitle, setRemoteBikeTitle] = useState<string | null>(null);

  useEffect(() => {
    if (!session.ccvConfirmed) {
      router.replace("/checkout/payment/ccv");
    }
  }, [session.ccvConfirmed, router]);

  useEffect(() => {
    if (!configured || !session.bikeId) return;
    getBikeByIdRemote(session.bikeId).then((data) => {
      if (data) {
        setRemoteDailyRate(data.rate.dailyRate);
        setRemoteBikeTitle(data.bike.title);
      }
    });
  }, [configured, session.bikeId]);

  const bike = session.bikeId ? getBikeById(session.bikeId) : undefined;
  const market = session.marketId ? getMarketById(session.marketId) : undefined;

  const days =
    session.tripStart && session.tripEnd
      ? Math.max(
          1,
          Math.ceil(
            (parseIsoDateOnlyLocal(session.tripEnd).getTime() -
              parseIsoDateOnlyLocal(session.tripStart).getTime()) /
              (86400 * 1000),
          ) + 1,
        )
      : 3;
  const daily = remoteDailyRate ?? bike?.dailyPrice ?? 0;
  const bikeTotal = daily * days;
  const pickupFee =
    session.delivery.mode === "delivery" && session.delivery.returnPickup ? RETURN_PICKUP_FEE : 0;

  async function handleConfirm() {
    if (!session.bikeId || !session.tripStart || !session.tripEnd) {
      setError("Select a bike and trip dates before confirming.");
      return;
    }

    if (configured) {
      setPending(true);
      setError(null);
      const result = await createReservation({
        bikeId: session.bikeId,
        startDate: session.tripStart,
        endDate: session.tripEnd,
        deliveryMode: session.delivery.mode,
        addOns: session.addOns as Record<string, string>,
      });
      setPending(false);
      if (!result.ok) {
        setError(result.error ?? "Could not create reservation");
        return;
      }
      patch({ checkoutConfirmed: true });
      router.push("/checkout/success");
      return;
    }

    patch({ checkoutConfirmed: true });
    router.push("/checkout/success");
  }

  if (!session.ccvConfirmed) {
    return (
      <PocCard>
        <PocMuted>Redirecting to CCV…</PocMuted>
      </PocCard>
    );
  }

  const bikeLabel = remoteBikeTitle ?? bike?.name ?? "Selected bike";

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Confirm reservation</PocH1>
        <PocMuted>
          {configured
            ? "Creates a reservation in Supabase. Without Stripe keys, payment is skipped in dev."
            : "Demo mode — no backend reservation."}
        </PocMuted>
        {error ? <p role="alert">{error}</p> : null}
        <ul className={styles.summaryList}>
          <li>Bike: {bikeLabel}</li>
          <li>Market: {market?.label ?? "—"}</li>
          <li>
            Dates: {formatDisplayDate(session.tripStart) || "—"} → {formatDisplayDate(session.tripEnd) || "—"}
          </li>
          <li>Delivery mode: {session.delivery.mode ?? "n/a"}</li>
          <li>Est. bike subtotal: ${bikeTotal}</li>
          {pickupFee > 0 && <li>Return pickup: ${pickupFee}</li>}
        </ul>
        <PocButton type="button" onClick={handleConfirm} disabled={pending}>
          {pending ? "Confirming…" : "Pay and confirm"}
        </PocButton>
      </PocStack>
    </PocCard>
  );
}
