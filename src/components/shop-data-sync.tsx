"use client";

import { useEffect } from "react";
import { getMyShopWorkspace } from "@/app/actions/shops";
import { useShopSession } from "@/context/shop-session";
import { useSupabase } from "@/context/supabase-provider";

/** Loads shop workspace from Supabase when a shop user is signed in. */
export function ShopDataSync() {
  const { configured, user, profile, loading } = useSupabase();
  const { shopAuth, patchShopAuth, loadWorkspace } = useShopSession();

  useEffect(() => {
    if (!configured || loading) return;

    if (user && profile?.role === "shop") {
      patchShopAuth({ isAuthenticated: true });
      if (shopAuth.ftuePhase === null) {
        getMyShopWorkspace().then((workspace) => {
          if (workspace) loadWorkspace(workspace);
        });
      }
    } else if (!user && shopAuth.isAuthenticated) {
      patchShopAuth({ isAuthenticated: false, ftuePhase: "login" });
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
  ]);

  return null;
}
