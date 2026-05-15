"use server";

import { createClient } from "@/lib/supabase/server";
import { getBikeById } from "@/app/actions/bikes";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

function rentalDays(start: string, end: string): number {
  const s = new Date(`${start}T12:00:00`);
  const e = new Date(`${end}T12:00:00`);
  return Math.max(1, Math.ceil((e.getTime() - s.getTime()) / 86400000) + 1);
}

export async function createReservation(input: {
  bikeId: string;
  startDate: string;
  endDate: string;
  deliveryMode?: string | null;
  addOns?: Record<string, string>;
}): Promise<{
  ok: boolean;
  reservationId?: string;
  clientSecret?: string;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to reserve a bike" };

  const listing = await getBikeById(input.bikeId);
  if (!listing) return { ok: false, error: "Bike not found" };

  const days = rentalDays(input.startDate, input.endDate);
  const totalCents = Math.round(listing.rate.dailyRate * days * 100);

  const { data: reservation, error } = await supabase
    .from("reservations")
    .insert({
      bike_id: input.bikeId,
      shop_id: listing.bike.shopId,
      rider_id: user.id,
      start_date: input.startDate,
      end_date: input.endDate,
      status: "pending_payment",
      total_cents: totalCents,
      delivery_mode: input.deliveryMode ?? null,
      add_ons: input.addOns ?? {},
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23P01") {
      return { ok: false, error: "Those dates are no longer available for this bike." };
    }
    return { ok: false, error: error.message };
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    const { error: confirmError } = await supabase
      .from("reservations")
      .update({ status: "confirmed", updated_at: new Date().toISOString() })
      .eq("id", reservation.id);

    if (confirmError) return { ok: false, error: confirmError.message };
    revalidatePath("/trips");
    revalidatePath("/dashboard");
    return { ok: true, reservationId: reservation.id };
  }

  const stripe = new Stripe(stripeKey);
  const intent = await stripe.paymentIntents.create({
    amount: totalCents,
    currency: "usd",
    metadata: { reservation_id: reservation.id, bike_id: input.bikeId },
    automatic_payment_methods: { enabled: true },
  });

  await supabase
    .from("reservations")
    .update({
      stripe_payment_intent_id: intent.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reservation.id);

  revalidatePath("/trips");
  return {
    ok: true,
    reservationId: reservation.id,
    clientSecret: intent.client_secret ?? undefined,
  };
}

export async function confirmReservationPayment(reservationId: string): Promise<AuthResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reservations")
    .update({ status: "confirmed", updated_at: new Date().toISOString() })
    .eq("id", reservationId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/trips");
  revalidatePath("/dashboard");
  return { ok: true };
}

type AuthResult = { ok: true } | { ok: false; error: string };

export async function getMyReservations() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: rows } = await supabase
    .from("reservations")
    .select("*")
    .eq("rider_id", user.id)
    .order("start_date", { ascending: false });

  const reservations = rows ?? [];
  const bikeIds = [...new Set(reservations.map((r) => r.bike_id))];
  const titles = new Map<string, string>();

  if (bikeIds.length) {
    const { data: bikes } = await supabase.from("bikes").select("id, title").in("id", bikeIds);
    for (const bike of bikes ?? []) {
      titles.set(bike.id, bike.title);
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  return reservations.map((row) => ({
    id: row.id,
    location: "",
    bikeName: titles.get(row.bike_id) ?? "Bike",
    startDate: row.start_date,
    endDate: row.end_date,
    status: (row.end_date < today ? "past" : "upcoming") as "upcoming" | "past",
  }));
}

export async function getShopReservations() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user.id).maybeSingle();
  if (!shop) return [];

  const { data } = await supabase
    .from("reservations")
    .select("*")
    .eq("shop_id", shop.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}
