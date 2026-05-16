type MarketRef = { id: string; label: string };

export function matchMarketIdForShopLocation(
  city: string,
  state: string,
  markets: MarketRef[],
): string | null {
  const location = `${city}, ${state}`.trim().toLowerCase();
  if (!location || location === ",") return null;
  const hit = markets.find(
    (m) =>
      m.label.toLowerCase() === location ||
      m.label.toLowerCase().includes(location) ||
      location.includes(m.label.toLowerCase()),
  );
  return hit?.id ?? null;
}

export function shopLocationMatchesMarketLabel(
  city: string,
  state: string,
  marketLabel: string,
): boolean {
  const location = `${city}, ${state}`.trim().toLowerCase();
  const label = marketLabel.toLowerCase();
  if (!location || location === ",") return false;
  return label === location || label.includes(location) || location.includes(label);
}
