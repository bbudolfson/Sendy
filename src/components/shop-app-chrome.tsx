"use client";

import type { ReactNode } from "react";
import { ShopOnboardingWizard } from "@/components/shop-onboarding-wizard";
import { ShopShell } from "@/components/shop-shell";
import { useShopSession } from "@/context/shop-session";
import { useSupabase } from "@/context/supabase-provider";

/** Full-screen FTUE wizard until signup/login completes; otherwise main shop shell + routes. */
export function ShopAppChrome({ children }: { children: ReactNode }) {
  const { shopAuth } = useShopSession();
  const { configured, user, profile, loading } = useSupabase();

  const localFtueComplete = shopAuth.isAuthenticated && shopAuth.ftuePhase === null;
  const activeOnboarding =
    shopAuth.ftuePhase != null && shopAuth.ftuePhase !== "login";
  const supabaseShopUser =
    configured && !loading && !!user && profile?.role === "shop";

  // Signed-in shop owners see the dashboard shell; only show the wizard for active onboarding steps.
  const showShell = localFtueComplete || (supabaseShopUser && !activeOnboarding);

  if (!showShell) return <ShopOnboardingWizard />;
  return <ShopShell>{children}</ShopShell>;
}
