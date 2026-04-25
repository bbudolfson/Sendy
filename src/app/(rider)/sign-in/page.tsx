"use client";

import { useRouter } from "next/navigation";
import {
  PocButton,
  PocCard,
  PocH1,
  PocInput,
  PocLabel,
  PocMuted,
  PocStack,
} from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";

export default function SignInPage() {
  const router = useRouter();
  const { patch } = usePocSession();

  return (
    <PocCard>
      <PocStack gap="md">
        <PocH1>Sign in</PocH1>
        <PocMuted>Choose a demo path. No real authentication.</PocMuted>
        <PocStack gap="sm">
          <PocLabel>Email</PocLabel>
          <PocInput type="email" placeholder="you@example.com" />
          <PocLabel>Password</PocLabel>
          <PocInput type="password" placeholder="••••••••" />
        </PocStack>
        <PocStack gap="sm">
          <PocButton
            type="button"
            onClick={() => {
              patch({
                isLoggedIn: true,
                riderName: "Alex Rider",
                isReturningUser: true,
                hasCompletedFtue: true,
              });
              router.push("/dashboard");
            }}
          >
            Continue as returning rider
          </PocButton>
          <PocButton
            type="button"
            variant="secondary"
            onClick={() => {
              patch({
                isLoggedIn: true,
                riderName: "Alex Rider",
                isReturningUser: false,
                hasCompletedFtue: false,
              });
              router.push("/ftue/profile");
            }}
          >
            Continue as new rider (FTUE)
          </PocButton>
          <PocButton
            type="button"
            variant="ghost"
            onClick={() => {
              patch({
                isLoggedIn: true,
                riderName: "Alex Rider",
                hasSavedPaymentMethod: false,
                hasEnteredNewCard: false,
                ccvConfirmed: false,
                checkoutConfirmed: false,
                accepted: true,
                bikeId: "bike-yeti-sb130",
                marketId: "moab",
                tripLocation: "Moab, UT",
                tripStart: "2026-05-01",
                tripEnd: "2026-05-05",
                datesKnown: true,
                delivery: {
                  mode: "pickup",
                  addressKnown: null,
                  address: "",
                  locationType: "",
                  windowId: "",
                  returnPickup: false,
                  returnPickupPriceConfirmed: false,
                  cancellationAck: false,
                },
              });
              router.push("/checkout/payment/new");
            }}
          >
            Skip to new-card checkout (demo)
          </PocButton>
        </PocStack>
        <a href="/forgot-password" style={{ fontSize: "0.875rem" }}>
          Forgot password
        </a>
        <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
          Or <strong>Google SSO</strong> (not wired in POC).
        </p>
      </PocStack>
    </PocCard>
  );
}
