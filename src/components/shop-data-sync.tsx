"use client";

import { useEffect } from "react";
import { getMyShopWorkspace } from "@/app/actions/shops";
import { useShopSession } from "@/context/shop-session";
import { useSupabase } from "@/context/supabase-provider";
import { isPersistedShopId } from "@/lib/shop-id";

/** Loads shop workspace from Supabase when a shop user is signed in. */
export function ShopDataSync() {
  const { configured, user, profile, loading } = useSupabase();
  const { session, shopAuth, patchShopAuth, loadWorkspace } = useShopSession();

  useEffect(() => {
    if (!configured || loading) return;

    if (user && profile?.role === "shop") {
      patchShopAuth({ isAuthenticated: true });
      const shouldLoadWorkspace =
        shopAuth.ftuePhase === null || !isPersistedShopId(session.profile.id);
      if (shouldLoadWorkspace) {
        getMyShopWorkspace().then((workspace) => {
          if (workspace) loadWorkspace(workspace);
        });
      }
    } else if (!user && shopAuth.isAuthenticated) {
      // Keep onboarding step when session is briefly unavailable (e.g. after server revalidate).
      const inOnboarding = shopAuth.ftuePhase != null && shopAuth.ftuePhase !== "login";
      patchShopAuth(
        inOnboarding
          ? { isAuthenticated: false }
          : { isAuthenticated: false, ftuePhase: "login" },
      );
    }
  }, [
    configured,
    loading,
    user,
    profile,
    patchShopAuth,
    loadWorkspace,
    shopAuth.isAuthenticated,
    shopAuth.ftuePhase,
    session.profile.id,
  ]);

  return null;
}
