"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AddonSelection } from "@/lib/domain/types";
import { getMarketById } from "@/lib/dummy-data";

export type DeliveryDraft = {
  mode: "pickup" | "delivery" | null;
  addressKnown: boolean | null;
  address: string;
  locationType: string;
  windowId: string;
  returnPickup: boolean;
  returnPickupPriceConfirmed: boolean;
  cancellationAck: boolean;
};

export type PocSession = {
  /** Quick path: skip FTUE */
  isReturningUser: boolean;
  hasCompletedFtue: boolean;
  tripLocation: string;
  tripStart: string | null;
  tripEnd: string | null;
  riderCount: number | null;
  marketId: string | null;
  selectedTripType: string | null;
  datesKnown: boolean;
  useFallbackBikes: boolean;
  bikeId: string | null;
  addOns: AddonSelection;
  accepted: boolean;
  delivery: DeliveryDraft;
  /** Saved card on file for demo checkout */
  hasSavedPaymentMethod: boolean;
  hasEnteredNewCard: boolean;
  ccvConfirmed: boolean;
  checkoutConfirmed: boolean;
};

const defaultDelivery: DeliveryDraft = {
  mode: null,
  addressKnown: null,
  address: "",
  locationType: "",
  windowId: "",
  returnPickup: false,
  returnPickupPriceConfirmed: false,
  cancellationAck: false,
};

const defaultSession: PocSession = {
  isReturningUser: true,
  hasCompletedFtue: true,
  tripLocation: "",
  tripStart: null,
  tripEnd: null,
  riderCount: null,
  marketId: null,
  selectedTripType: null,
  datesKnown: false,
  useFallbackBikes: false,
  bikeId: null,
  addOns: {},
  accepted: false,
  delivery: { ...defaultDelivery },
  hasSavedPaymentMethod: true,
  hasEnteredNewCard: false,
  ccvConfirmed: false,
  checkoutConfirmed: false,
};

type PocContextValue = {
  session: PocSession;
  patch: (partial: Partial<PocSession>) => void;
  patchDelivery: (partial: Partial<DeliveryDraft>) => void;
  resetReservation: () => void;
  resetAll: () => void;
};

const PocContext = createContext<PocContextValue | null>(null);

export function PocSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<PocSession>(defaultSession);

  const patch = useCallback((partial: Partial<PocSession>) => {
    setSession((s) => {
      const next: PocSession = { ...s, ...partial };
      if (partial.delivery !== undefined) {
        next.delivery = { ...s.delivery, ...partial.delivery };
      }
      if (partial.addOns !== undefined) {
        next.addOns = partial.addOns;
      }
      return next;
    });
  }, []);

  const patchDelivery = useCallback((partial: Partial<DeliveryDraft>) => {
    setSession((s) => ({
      ...s,
      delivery: { ...s.delivery, ...partial },
    }));
  }, []);

  const resetReservation = useCallback(() => {
    setSession((s) => ({
      ...s,
      tripLocation: "",
      tripStart: null,
      tripEnd: null,
      riderCount: null,
      marketId: null,
      selectedTripType: null,
      datesKnown: false,
      useFallbackBikes: false,
      bikeId: null,
      addOns: {},
      accepted: false,
      delivery: { ...defaultDelivery },
      hasEnteredNewCard: false,
      ccvConfirmed: false,
      checkoutConfirmed: false,
    }));
  }, []);

  const resetAll = useCallback(() => {
    setSession({ ...defaultSession });
  }, []);

  const value = useMemo(
    () => ({ session, patch, patchDelivery, resetReservation, resetAll }),
    [session, patch, patchDelivery, resetReservation, resetAll],
  );

  return <PocContext.Provider value={value}>{children}</PocContext.Provider>;
}

export function usePocSession() {
  const ctx = useContext(PocContext);
  if (!ctx) throw new Error("usePocSession must be used within PocSessionProvider");
  return ctx;
}

/** True when checkout flow is allowed (after accept + bike). */
export function canEnterCheckout(session: PocSession): boolean {
  if (!session.accepted || !session.bikeId || !session.marketId) return false;

  const market = getMarketById(session.marketId);
  if (!market?.deliveryAvailable) {
    return true;
  }

  if (session.delivery.mode === "pickup") return true;

  if (session.delivery.mode === "delivery") {
    if (!session.delivery.windowId) return false;
    if (session.delivery.addressKnown === true && !session.delivery.address.trim()) {
      return false;
    }
    if (
      session.delivery.returnPickup &&
      (!session.delivery.returnPickupPriceConfirmed ||
        !session.delivery.cancellationAck)
    ) {
      return false;
    }
    return true;
  }

  return false;
}
