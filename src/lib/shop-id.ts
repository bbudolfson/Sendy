/** True when the id is a persisted Supabase shop uuid (not a client-only temp id). */
export function isPersistedShopId(id: string): boolean {
  return /^[0-9a-f-]{36}$/i.test(id);
}
