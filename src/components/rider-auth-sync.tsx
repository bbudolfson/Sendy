"use client";

import { useEffect } from "react";
import { usePocSession } from "@/context/poc-session";
import { useSupabase } from "@/context/supabase-provider";

/** Mirrors Supabase rider session into POC UI state when backend auth is enabled. */
export function RiderAuthSync() {
  const { configured, user, profile, loading } = useSupabase();
  const { patch } = usePocSession();

  useEffect(() => {
    if (!configured || loading) return;
    if (user && profile?.role === "rider") {
      patch({
        isLoggedIn: true,
        riderName: profile.full_name || user.email?.split("@")[0] || "Rider",
        hasCompletedFtue: true,
        isReturningUser: true,
      });
    } else if (!user) {
      patch({ isLoggedIn: false, riderName: "" });
    }
  }, [configured, loading, user, profile, patch]);

  return null;
}
