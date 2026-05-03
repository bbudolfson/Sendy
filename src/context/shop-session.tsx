"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AvailabilityRule,
  BlockedDate,
  DeliveryZone,
  EmbedLink,
  PaymentConnection,
  PaymentConnectionStatus,
  RatePlan,
  ShopBike,
  ShopProfile,
} from "@/lib/domain/types";
import type { ShopAuth } from "@/lib/shop-ftue-types";
import { defaultShopAuth } from "@/lib/shop-ftue-types";
import {
  SHOP_AVAILABILITY_RULES,
  SHOP_BIKES,
  SHOP_BLOCKED_DATES,
  SHOP_DELIVERY_ZONES,
  SHOP_EMBED_LINKS,
  SHOP_PAYMENT_CONNECTION,
  SHOP_PROFILE_DEMO,
  SHOP_RATE_PLANS,
} from "@/lib/dummy-data";

type ShopSession = {
  profile: ShopProfile;
  inventory: ShopBike[];
  availabilityRules: AvailabilityRule[];
  blockedDates: BlockedDate[];
  rates: RatePlan[];
  deliveryZones: DeliveryZone[];
  payment: PaymentConnection;
  embedLinks: EmbedLink[];
};

type ShopSessionValue = {
  session: ShopSession;
  shopAuth: ShopAuth;
  patchShopProfile: (partial: Partial<ShopProfile>) => void;
  patchShopAuth: (partial: Partial<ShopAuth>) => void;
  upsertBikeDraft: (bike: ShopBike) => void;
  setBikeAvailabilityRules: (bikeId: string, rules: AvailabilityRule[]) => void;
  addBikeBlockedDate: (entry: BlockedDate) => void;
  removeBikeBlockedDate: (bikeId: string, date: string) => void;
  setBikeRates: (rate: RatePlan) => void;
  setPaymentConnectionState: (status: PaymentConnectionStatus) => void;
  patchShopPayment: (partial: Partial<PaymentConnection>) => void;
  addDeliveryZone: (zone: DeliveryZone) => void;
  addEmbedLink: (link: EmbedLink) => void;
  profileCompletion: number;
  canPublishInventory: boolean;
  canEnableEmbed: boolean;
  resetShopSession: () => void;
  /** Demo “existing account” login — loads full demo workspace. */
  completeShopReturningLogin: () => void;
  /** Create-account step: validates email/password, advances to verify_email. Returns false if duplicate (demo). */
  submitShopSignupStart: (
    email: string,
    password: string,
  ) => {
    ok: boolean;
    error?: "duplicate" | "password";
  };
  /** After “email verified”, blank workspace for new merchant. */
  advanceShopPastEmailVerified: (signupEmail: string) => void;
  /** Ends FTUE shell gating — user sees ShopShell + dashboard/task lists. */
  completeShopSignupToDashboard: () => void;
};

const ShopSessionContext = createContext<ShopSessionValue | null>(null);

function createInitialShopSession(): ShopSession {
  return {
    profile: { ...SHOP_PROFILE_DEMO },
    inventory: [...SHOP_BIKES],
    availabilityRules: [...SHOP_AVAILABILITY_RULES],
    blockedDates: [...SHOP_BLOCKED_DATES],
    rates: [...SHOP_RATE_PLANS],
    deliveryZones: [...SHOP_DELIVERY_ZONES],
    payment: { ...SHOP_PAYMENT_CONNECTION },
    embedLinks: [...SHOP_EMBED_LINKS],
  };
}

function createBlankSignupShopSession(email: string): ShopSession {
  const shopId = `shop-${Date.now().toString(36)}`;
  const blankProfile: ShopProfile = {
    id: shopId,
    shopName: "",
    shopEmail: email.trim(),
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    logoUrl: "",
    websiteUrl: "",
    supportPhone: "",
    serviceAreaNotes: "",
  };
  const payment: PaymentConnection = {
    provider: "stripe",
    status: "not_connected",
    payoutsEnabled: false,
    accountLabel: "",
  };

  return {
    profile: blankProfile,
    inventory: [],
    availabilityRules: [],
    blockedDates: [],
    rates: [],
    deliveryZones: [],
    payment,
    embedLinks: [],
  };
}

/** Demo heuristic: treating the seeded shop email as “already registered.” */
function isDuplicateShopSignupEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  return e === SHOP_PROFILE_DEMO.shopEmail.trim().toLowerCase();
}

export function ShopSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<ShopSession>(() => createInitialShopSession());
  const [shopAuth, setShopAuth] = useState<ShopAuth>(() => defaultShopAuth());

  const patchShopAuth = useCallback((partial: Partial<ShopAuth>) => {
    setShopAuth((a) => ({ ...a, ...partial }));
  }, []);

  const resetShopSession = useCallback(() => {
    setSession(createInitialShopSession());
    setShopAuth(defaultShopAuth());
  }, []);

  const completeShopReturningLogin = useCallback(() => {
    setSession(createInitialShopSession());
    setShopAuth(() => ({
      ...defaultShopAuth(),
      isAuthenticated: true,
      ftuePhase: null,
    }));
  }, []);

  const submitShopSignupStart = useCallback((email: string, password: string) => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (trimmedPassword.length < 8) {
      return { ok: false as const, error: "password" as const };
    }
    if (isDuplicateShopSignupEmail(trimmedEmail)) {
      setShopAuth((a) => ({
        ...a,
        signupDuplicateEmail: true,
      }));
      return { ok: false as const, error: "duplicate" as const };
    }
    setShopAuth((a) => ({
      ...a,
      signupEmail: trimmedEmail,
      signupPassword: trimmedPassword,
      signupDuplicateEmail: false,
      ftuePhase: "verify_email",
    }));
    return { ok: true as const };
  }, []);

  const advanceShopPastEmailVerified = useCallback((signupEmail: string) => {
    setSession(createBlankSignupShopSession(signupEmail));
    setShopAuth((a) => ({
      ...a,
      ftuePhase: "create_store_profile",
      verifyResendCooldownUntil: 0,
    }));
  }, []);

  const completeShopSignupToDashboard = useCallback(() => {
    setShopAuth((a) => ({
      ...a,
      isAuthenticated: true,
      ftuePhase: null,
    }));
  }, []);

  const patchShopProfile = useCallback((partial: Partial<ShopProfile>) => {
    setSession((current) => ({
      ...current,
      profile: { ...current.profile, ...partial },
    }));
  }, []);

  const upsertBikeDraft = useCallback((bike: ShopBike) => {
    setSession((current) => {
      const exists = current.inventory.some((item) => item.id === bike.id);
      if (!exists) return { ...current, inventory: [bike, ...current.inventory] };
      return {
        ...current,
        inventory: current.inventory.map((item) => (item.id === bike.id ? bike : item)),
      };
    });
  }, []);

  const setBikeAvailabilityRules = useCallback((bikeId: string, rules: AvailabilityRule[]) => {
    setSession((current) => ({
      ...current,
      availabilityRules: [
        ...current.availabilityRules.filter((rule) => rule.bikeId !== bikeId),
        ...rules,
      ],
    }));
  }, []);

  const addBikeBlockedDate = useCallback((entry: BlockedDate) => {
    setSession((current) => ({
      ...current,
      blockedDates: [entry, ...current.blockedDates.filter((item) => item.date !== entry.date || item.bikeId !== entry.bikeId)],
    }));
  }, []);

  const removeBikeBlockedDate = useCallback((bikeId: string, date: string) => {
    setSession((current) => ({
      ...current,
      blockedDates: current.blockedDates.filter((item) => !(item.bikeId === bikeId && item.date === date)),
    }));
  }, []);

  const setBikeRates = useCallback((rate: RatePlan) => {
    setSession((current) => {
      const exists = current.rates.some((item) => item.bikeId === rate.bikeId);
      if (!exists) return { ...current, rates: [rate, ...current.rates] };
      return {
        ...current,
        rates: current.rates.map((item) => (item.bikeId === rate.bikeId ? rate : item)),
      };
    });
  }, []);

  const setPaymentConnectionState = useCallback((status: PaymentConnectionStatus) => {
    setSession((current) => ({
      ...current,
      payment: {
        ...current.payment,
        status,
        payoutsEnabled: status === "connected",
      },
    }));
  }, []);

  const patchShopPayment = useCallback((partial: Partial<PaymentConnection>) => {
    setSession((current) => ({
      ...current,
      payment: { ...current.payment, ...partial },
    }));
  }, []);

  const addDeliveryZone = useCallback((zone: DeliveryZone) => {
    setSession((current) => ({
      ...current,
      deliveryZones: [zone, ...current.deliveryZones.filter((item) => item.id !== zone.id)],
    }));
  }, []);

  const addEmbedLink = useCallback((link: EmbedLink) => {
    setSession((current) => ({
      ...current,
      embedLinks: [link, ...current.embedLinks.filter((item) => item.id !== link.id)],
    }));
  }, []);

  const profileCompletion = useMemo(() => {
    const checks = [
      !!session.profile.shopName,
      !!session.profile.shopEmail.trim(),
      !!session.profile.supportPhone.trim(),
      !!session.profile.addressLine1,
      !!session.profile.city,
      !!session.profile.state,
      !!session.profile.postalCode,
      !!session.profile.websiteUrl.trim(),
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [session.profile]);

  const canPublishInventory = profileCompletion >= 80;
  const canEnableEmbed = canPublishInventory && session.payment.status === "connected";

  const value = useMemo(
    () => ({
      session,
      shopAuth,
      patchShopProfile,
      patchShopAuth,
      upsertBikeDraft,
      setBikeAvailabilityRules,
      addBikeBlockedDate,
      removeBikeBlockedDate,
      setBikeRates,
      setPaymentConnectionState,
      patchShopPayment,
      addDeliveryZone,
      addEmbedLink,
      profileCompletion,
      canPublishInventory,
      canEnableEmbed,
      resetShopSession,
      completeShopReturningLogin,
      submitShopSignupStart,
      advanceShopPastEmailVerified,
      completeShopSignupToDashboard,
    }),
    [
      session,
      shopAuth,
      patchShopProfile,
      patchShopAuth,
      upsertBikeDraft,
      setBikeAvailabilityRules,
      addBikeBlockedDate,
      removeBikeBlockedDate,
      setBikeRates,
      setPaymentConnectionState,
      patchShopPayment,
      addDeliveryZone,
      addEmbedLink,
      profileCompletion,
      canPublishInventory,
      canEnableEmbed,
      resetShopSession,
      completeShopReturningLogin,
      submitShopSignupStart,
      advanceShopPastEmailVerified,
      completeShopSignupToDashboard,
    ],
  );

  return <ShopSessionContext.Provider value={value}>{children}</ShopSessionContext.Provider>;
}

export function useShopSession() {
  const ctx = useContext(ShopSessionContext);
  if (!ctx) throw new Error("useShopSession must be used within ShopSessionProvider");
  return ctx;
}
