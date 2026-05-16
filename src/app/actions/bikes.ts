"use server";

import { createClient } from "@/lib/supabase/server";
import {
  bikeRowToRatePlan,
  bikeRowToShopBike,
  bikeToListing,
  shopBikeToInsert,
} from "@/lib/supabase/mappers";
import type { DbBike } from "@/lib/supabase/database.types";
import type { RatePlan, ShopBike } from "@/lib/domain/types";
import { getMyShop } from "@/app/actions/shops";
import { getShopIdsInMarket } from "@/app/actions/markets";
import { revalidatePath } from "next/cache";

export async function searchBikes(marketId: string | null, start?: string | null, end?: string | null) {
  const supabase = await createClient();

  let query = supabase.from("bikes").select("*").eq("status", "active");

  if (marketId) {
    const shopIds = await getShopIdsInMarket(marketId);
    if (!shopIds.length) return { bikes: [], error: null };
    query = query.in("shop_id", shopIds);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return { bikes: [], error: error.message };

  const rows = (data ?? []) as DbBike[];
  const shopIds = [...new Set(rows.map((r) => r.shop_id))];
  const shopNames = new Map<string, string>();
  const shopMarketIds = new Map<string, string | null>();

  if (shopIds.length) {
    const { data: shops } = await supabase
      .from("shops")
      .select("id, shop_name, market_id")
      .in("id", shopIds);
    for (const shop of shops ?? []) {
      shopNames.set(shop.id, shop.shop_name);
      shopMarketIds.set(shop.id, shop.market_id);
    }
  }

  const bikes = rows.map((row) =>
    bikeToListing(
      row,
      shopNames.get(row.shop_id) ?? "Local shop",
      row.market_id ?? shopMarketIds.get(row.shop_id) ?? null,
    ),
  );

  if (!start || !end) {
    return { bikes, error: null };
  }

  const bikeIds = bikes.map((b) => b.id);
  if (!bikeIds.length) return { bikes: [], error: null };

  const { data: conflicts } = await supabase
    .from("reservations")
    .select("bike_id, start_date, end_date")
    .in("bike_id", bikeIds)
    .in("status", ["pending_payment", "confirmed"])
    .lte("start_date", end)
    .gte("end_date", start);

  const blocked = new Set((conflicts ?? []).map((r) => r.bike_id));
  return {
    bikes: bikes.filter((b) => !blocked.has(b.id)),
    error: null,
  };
}

export async function getBikeById(id: string) {
  const supabase = await createClient();
  const { data: bikeRow, error } = await supabase.from("bikes").select("*").eq("id", id).maybeSingle();

  if (error || !bikeRow) return null;

  const bike = bikeRow as DbBike;
  const { data: shop } = await supabase
    .from("shops")
    .select("shop_name, city, state")
    .eq("id", bike.shop_id)
    .maybeSingle();

  return {
    bike: bikeRowToShopBike(bike),
    rate: bikeRowToRatePlan(bike),
    shopName: shop?.shop_name ?? "",
    location: shop ? `${shop.city}, ${shop.state}` : "",
  };
}

export async function upsertShopBike(
  bike: ShopBike,
  rates: RatePlan,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const shop = await getMyShop();
  if (!shop) return { ok: false, error: "Sign in as a shop to manage inventory" };

  const supabase = await createClient();
  const payload = shopBikeToInsert({ ...bike, shopId: shop.id }, rates, shop.market_id);

  const isUuid = /^[0-9a-f-]{36}$/i.test(bike.id);
  if (isUuid) {
    const { error } = await supabase.from("bikes").update(payload).eq("id", bike.id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/shop");
    revalidatePath("/dashboard");
    return { ok: true, id: bike.id };
  }

  const { data, error } = await supabase.from("bikes").insert(payload).select("id").single();

  if (error) return { ok: false, error: error.message };
  revalidatePath("/shop");
  revalidatePath("/dashboard");
  return { ok: true, id: data.id };
}

export async function uploadBikePhoto(
  formData: FormData,
): Promise<{ ok: boolean; url?: string; error?: string }> {
  const shop = await getMyShop();
  if (!shop) return { ok: false, error: "Not authenticated as shop" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "No file" };

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("bike-photos")
    .upload(path, file, { upsert: false, contentType: file.type });

  if (uploadError) return { ok: false, error: uploadError.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("bike-photos").getPublicUrl(path);

  return { ok: true, url: publicUrl };
}
