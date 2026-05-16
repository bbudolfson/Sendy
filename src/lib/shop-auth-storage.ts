import type { ShopAuth } from "@/lib/shop-ftue-types";
import { defaultShopAuth } from "@/lib/shop-ftue-types";

const STORAGE_KEY = "sendy-shop-ftue";

type PersistedShopAuth = Pick<
  ShopAuth,
  "ftuePhase" | "signupEmail" | "isAuthenticated" | "signupDuplicateEmail" | "verifyResendCooldownUntil"
>;

export function readPersistedShopAuth(): ShopAuth {
  const base = defaultShopAuth();
  if (typeof window === "undefined") return base;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<PersistedShopAuth>;
    return {
      ...base,
      ...parsed,
      signupPassword: "",
    };
  } catch {
    return base;
  }
}

export function persistShopAuth(auth: ShopAuth): void {
  if (typeof window === "undefined") return;
  if (auth.ftuePhase === null && auth.isAuthenticated) {
    sessionStorage.removeItem(STORAGE_KEY);
    return;
  }

  const payload: PersistedShopAuth = {
    ftuePhase: auth.ftuePhase,
    signupEmail: auth.signupEmail,
    isAuthenticated: auth.isAuthenticated,
    signupDuplicateEmail: auth.signupDuplicateEmail,
    verifyResendCooldownUntil: auth.verifyResendCooldownUntil,
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function clearPersistedShopAuth(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
