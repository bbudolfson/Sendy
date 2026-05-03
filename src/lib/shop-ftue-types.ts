/** Shop onboarding — matches Product spec “Shop Login & Account Setup” (Notion). */
export type ShopFtuePhase =
  | "login"
  | "create_account"
  | "verify_email"
  | "create_store_profile"
  | "payment_check"
  | "payment_connect"
  | "payment_skip"
  | "inventory_check"
  | "inventory_skip";

export type ShopAuth = {
  isAuthenticated: boolean;
  ftuePhase: ShopFtuePhase | null;
  signupEmail: string;
  signupPassword: string;
  verifyResendCooldownUntil: number;
  signupDuplicateEmail: boolean;
};

export function defaultShopAuth(): ShopAuth {
  return {
    isAuthenticated: false,
    ftuePhase: "login",
    signupEmail: "",
    signupPassword: "",
    verifyResendCooldownUntil: 0,
    signupDuplicateEmail: false,
  };
}
