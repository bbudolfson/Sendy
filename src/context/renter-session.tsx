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

type RenterSession = {
  profile: ShopProfile;
  inventory: ShopBike[];
  availabilityRules: AvailabilityRule[];
  blockedDates: BlockedDate[];
  rates: RatePlan[];
  deliveryZones: DeliveryZone[];
  payment: PaymentConnection;
  embedLinks: EmbedLink[];
};

const defaultSession: RenterSession = {
  profile: { ...SHOP_PROFILE_DEMO },
  inventory: [...SHOP_BIKES],
  availabilityRules: [...SHOP_AVAILABILITY_RULES],
  blockedDates: [...SHOP_BLOCKED_DATES],
  rates: [...SHOP_RATE_PLANS],
  deliveryZones: [...SHOP_DELIVERY_ZONES],
  payment: { ...SHOP_PAYMENT_CONNECTION },
  embedLinks: [...SHOP_EMBED_LINKS],
};

type RenterSessionValue = {
  session: RenterSession;
  patchShopProfile: (partial: Partial<ShopProfile>) => void;
  upsertBikeDraft: (bike: ShopBike) => void;
  setBikeAvailabilityRules: (bikeId: string, rules: AvailabilityRule[]) => void;
  addBikeBlockedDate: (entry: BlockedDate) => void;
  removeBikeBlockedDate: (bikeId: string, date: string) => void;
  setBikeRates: (rate: RatePlan) => void;
  setPaymentConnectionState: (status: PaymentConnectionStatus) => void;
  addDeliveryZone: (zone: DeliveryZone) => void;
  addEmbedLink: (link: EmbedLink) => void;
  profileCompletion: number;
  canPublishInventory: boolean;
  canEnableEmbed: boolean;
};

const RenterSessionContext = createContext<RenterSessionValue | null>(null);

export function RenterSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<RenterSession>(defaultSession);

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
      !!session.profile.ownerName,
      !!session.profile.shopName,
      !!session.profile.addressLine1,
      !!session.profile.city,
      !!session.profile.state,
      !!session.profile.postalCode,
      !!session.profile.logoUrl,
      !!session.profile.serviceAreaNotes,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [session.profile]);

  const canPublishInventory = profileCompletion >= 80;
  const canEnableEmbed = canPublishInventory && session.payment.status === "connected";

  const value = useMemo(
    () => ({
      session,
      patchShopProfile,
      upsertBikeDraft,
      setBikeAvailabilityRules,
      addBikeBlockedDate,
      removeBikeBlockedDate,
      setBikeRates,
      setPaymentConnectionState,
      addDeliveryZone,
      addEmbedLink,
      profileCompletion,
      canPublishInventory,
      canEnableEmbed,
    }),
    [
      session,
      patchShopProfile,
      upsertBikeDraft,
      setBikeAvailabilityRules,
      addBikeBlockedDate,
      removeBikeBlockedDate,
      setBikeRates,
      setPaymentConnectionState,
      addDeliveryZone,
      addEmbedLink,
      profileCompletion,
      canPublishInventory,
      canEnableEmbed,
    ],
  );

  return <RenterSessionContext.Provider value={value}>{children}</RenterSessionContext.Provider>;
}

export function useRenterSession() {
  const ctx = useContext(RenterSessionContext);
  if (!ctx) throw new Error("useRenterSession must be used within RenterSessionProvider");
  return ctx;
}
