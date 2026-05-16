"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import {
  bikeRowToRatePlan,
  bikeRowToShopBike,
  shopProfileToUpdate,
  shopRowToPayment,
  shopRowToProfile,
} from "@/lib/supabase/mappers";
import type { PaymentConnection, ShopProfile, RatePlan } from "@/lib/domain/types";
import { revalidatePath } from "next/cache";

type EnsureShopResult =
  | { shop: Database["public"]["Tables"]["shops"]["Row"]; error?: undefined }
  | { shop: null; error: string };

async function ensureMyShop(): Promise<EnsureShopResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { shop: null, error: "Not signed in. Sign in again and try saving." };
  }

  const { data: existing, error: selectError } = await supabase
    .from("shops")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (selectError) return { shop: null, error: selectError.message };
  if (existing) return { shop: existing };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "shop") {
    return { shop: null, error: "This account is not set up as a shop." };
  }

  const { data: created, error: insertError } = await supabase
    .from("shops")
    .insert({
      owner_id: user.id,
      shop_email: user.email ?? profile.email ?? "",
      shop_name: "",
    })
    .select("*")
    .single();

  if (insertError) return { shop: null, error: insertError.message };
  return { shop: created };
}

export async function getMyShop() {
  const { shop } = await ensureMyShop();
  return shop;
}

export async function getMyShopWorkspace() {
  const shop = await getMyShop();
  if (!shop) return null;

  const supabase = await createClient();
  const { data: bikes } = await supabase.from("bikes").select("*").eq("shop_id", shop.id);

  const inventory = (bikes ?? []).map(bikeRowToShopBike);
  const rates = (bikes ?? []).map(bikeRowToRatePlan);

  return {
    profile: shopRowToProfile(shop),
    payment: shopRowToPayment(shop),
    marketId: shop.market_id,
    inventory,
    rates,
  };
}

export async function updateMyShopProfile(
  profile: ShopProfile,
  marketId?: string | null,
): Promise<{ ok: boolean; error?: string }> {
  const { shop, error: ensureError } = await ensureMyShop();
  if (!shop) return { ok: false, error: ensureError ?? "No shop found" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shops")
    .update({
      ...shopProfileToUpdate(profile, marketId),
      updated_at: new Date().toISOString(),
    })
    .eq("id", shop.id)
    .select("id")
    .maybeSingle();

  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: "Could not update shop profile. Check you are signed in." };
  revalidatePath("/shop");
  return { ok: true };
}

export async function updateMyShopPayment(
  payment: Partial<PaymentConnection>,
): Promise<{ ok: boolean; error?: string }> {
  const { shop, error: ensureError } = await ensureMyShop();
  if (!shop) return { ok: false, error: ensureError ?? "No shop found" };

  const supabase = await createClient();
  const patch: Database["public"]["Tables"]["shops"]["Update"] = {
    updated_at: new Date().toISOString(),
  };
  if (payment.provider) patch.payment_provider = payment.provider;
  if (payment.status) patch.payment_status = payment.status;
  if (payment.payoutsEnabled !== undefined) patch.payouts_enabled = payment.payoutsEnabled;
  if (payment.accountLabel !== undefined) patch.payment_account_label = payment.accountLabel;

  const { error } = await supabase.from("shops").update(patch).eq("id", shop.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/shop");
  return { ok: true };
}
