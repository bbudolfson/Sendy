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

export async function getMyShop() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: shop, error } = await supabase
    .from("shops")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error || !shop) return null;
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
  const shop = await getMyShop();
  if (!shop) return { ok: false, error: "No shop found" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("shops")
    .update({
      ...shopProfileToUpdate(profile, marketId),
      updated_at: new Date().toISOString(),
    })
    .eq("id", shop.id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/shop");
  return { ok: true };
}

export async function updateMyShopPayment(
  payment: Partial<PaymentConnection>,
): Promise<{ ok: boolean; error?: string }> {
  const shop = await getMyShop();
  if (!shop) return { ok: false, error: "No shop found" };

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
