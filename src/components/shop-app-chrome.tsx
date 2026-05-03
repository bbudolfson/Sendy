"use client";

import type { ReactNode } from "react";
import { ShopOnboardingWizard } from "@/components/shop-onboarding-wizard";
import { ShopShell } from "@/components/shop-shell";
import { useShopSession } from "@/context/shop-session";

/** Full-screen FTUE wizard until signup/login completes; otherwise main shop shell + routes. */
export function ShopAppChrome({ children }: { children: ReactNode }) {
  const { shopAuth } = useShopSession();
  const ftueDone = shopAuth.isAuthenticated && shopAuth.ftuePhase === null;
  if (!ftueDone) return <ShopOnboardingWizard />;
  return <ShopShell>{children}</ShopShell>;
}
