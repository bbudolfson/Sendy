"use server";

import { createClient } from "@/lib/supabase/server";
import { marketRowToDomain } from "@/lib/supabase/mappers";
import { shopLocationMatchesMarketLabel } from "@/lib/market-location";

export async function getMarkets() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("markets").select("*").order("label");
  if (error) return { markets: [], error: error.message };
  return { markets: (data ?? []).map(marketRowToDomain), error: null };
}

export async function getMarketById(id: string) {
  const { markets } = await getMarkets();
  return markets.find((m) => m.id === id) ?? null;
}

export async function resolveMarketFromLocation(input: string) {
  const q = input.trim().toLowerCase();
  if (!q) return { exists: false, market: null as ReturnType<typeof marketRowToDomain> | null };

  const { markets } = await getMarkets();
  const hit = markets.find(
    (m) =>
      m.label.toLowerCase().includes(q) ||
      q.includes(m.id) ||
      m.label.toLowerCase().replace(/\s/g, "").includes(q.replace(/\s/g, "")),
  );
  return { exists: !!hit, market: hit ?? null };
}

/** Shop ids whose profile location matches a curated market (for rider search). */
export async function getShopIdsInMarket(marketId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data: market } = await supabase
    .from("markets")
    .select("label")
    .eq("id", marketId)
    .maybeSingle();

  const { data: shops } = await supabase.from("shops").select("id, market_id, city, state");
  const label = market?.label ?? "";

  return (shops ?? [])
    .filter((shop) => {
      if (shop.market_id === marketId) return true;
      return shopLocationMatchesMarketLabel(shop.city, shop.state, label);
    })
    .map((shop) => shop.id);
}
