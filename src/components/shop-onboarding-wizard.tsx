"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PocButton, PocH1, PocInput, PocMuted } from "@/components/poc-ui";
import { useShopSession } from "@/context/shop-session";
import { SHOP_PROFILE_DEMO } from "@/lib/dummy-data";
import type { PaymentProvider } from "@/lib/domain/types";
import type { ShopFtuePhase } from "@/lib/shop-ftue-types";
import styles from "./shop-onboarding-wizard.module.css";

function useResendCooldown(until: number) {
  const [now, setNow] = useState(() => Date.now());
  const active = until > now;

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [active, until]);

  const secondsLeft = active ? Math.max(0, Math.ceil((until - now) / 1000)) : 0;
  return { active, secondsLeft };
}

export function ShopOnboardingWizard() {
  const router = useRouter();
  const [passwordTooShort, setPasswordTooShort] = useState(false);
  const {
    shopAuth,
    patchShopAuth,
    session,
    patchShopProfile,
    patchShopPayment,
    completeShopReturningLogin,
    submitShopSignupStart,
    advanceShopPastEmailVerified,
    completeShopSignupToDashboard,
  } = useShopSession();

  const phase = shopAuth.ftuePhase ?? "login";

  useEffect(() => {
    if (phase === "create_account") setPasswordTooShort(false);
  }, [phase]);
  const { active: resendCooldownActive, secondsLeft } = useResendCooldown(shopAuth.verifyResendCooldownUntil);

  const goPhase = useCallback((p: ShopFtuePhase | null) => patchShopAuth({ ftuePhase: p }), [patchShopAuth]);

  const connectPayment = useCallback(
    (provider: PaymentProvider) => {
      const label =
        provider === "stripe" ? "Stripe — demo connection" : "Square — demo connection";
      patchShopPayment({
        provider,
        status: "connected",
        payoutsEnabled: true,
        accountLabel: label,
      });
      patchShopAuth({ ftuePhase: "inventory_check" });
    },
    [patchShopAuth, patchShopPayment],
  );

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <span className={styles.logoRow}>
          <img src="/fitted-logo.png" alt="" className={styles.logoImg} />
          <span className={styles.logoSuffix}>Shop</span>
        </span>
      </header>
      <main className={styles.main}>
        <div className={styles.card}>
          {phase === "login" ? (
            <form
              className={styles.fieldStack}
              onSubmit={(e) => {
                e.preventDefault();
                completeShopReturningLogin();
              }}
            >
              <div className={styles.titleBlock}>
                <PocH1>Login</PocH1>
                <PocMuted>Existing shop account (prototype — any username/password works).</PocMuted>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="shop-login-user">
                  Username or email
                </label>
                <PocInput id="shop-login-user" name="username" autoComplete="username" required />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="shop-login-pass">
                  Password
                </label>
                <PocInput id="shop-login-pass" name="password" type="password" autoComplete="current-password" required />
              </div>
              <PocButton type="submit" fullWidth>
                Sign in
              </PocButton>
              <PocButton
                type="button"
                variant="secondary"
                fullWidth
                onClick={() => {
                  completeShopReturningLogin();
                }}
              >
                Connect with Google
              </PocButton>
              <PocButton type="button" variant="ghost" fullWidth onClick={() => goPhase("create_account")}>
                Create shop account
              </PocButton>
            </form>
          ) : null}

          {phase === "create_account" ? (
            <form
              className={styles.fieldStack}
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const email = String(fd.get("email") ?? "");
                const password = String(fd.get("password") ?? "");
                const result = submitShopSignupStart(email, password);
                setPasswordTooShort(!result.ok && result.error === "password");
              }}
            >
              <div className={styles.titleBlock}>
                <PocH1>Create account</PocH1>
                <PocMuted>We&apos;ll email you a confirmation link (demo flow).</PocMuted>
              </div>
              {passwordTooShort ? (
                <p className={styles.errorBox} role="alert">
                  Password must be at least 8 characters.
                </p>
              ) : null}
              {shopAuth.signupDuplicateEmail ? (
                <p className={styles.errorBox} role="alert">
                  An account with this email already exists. Log in instead.
                </p>
              ) : null}
              <div className={styles.field}>
                <label className={styles.label} htmlFor="shop-signup-email">
                  Email
                </label>
                <PocInput id="shop-signup-email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="shop-signup-password">
                  Password
                </label>
                <PocInput
                  id="shop-signup-password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  onChange={() => setPasswordTooShort(false)}
                />
              </div>
              <PocButton type="submit" fullWidth>
                Create account
              </PocButton>
              <p className={styles.note}>
                Demo duplicate: <strong>{SHOP_PROFILE_DEMO.shopEmail}</strong> is treated as already registered.
              </p>
              <div className={styles.backRow}>
                <PocButton type="button" variant="secondary" className={styles.backBtn} onClick={() => goPhase("login")}>
                  Back
                </PocButton>
              </div>
            </form>
          ) : null}

          {phase === "verify_email" ? (
            <div className={styles.fieldStack}>
              <div className={styles.titleBlock}>
                <PocH1>Verify email</PocH1>
                <PocMuted>Check your inbox and click the link to confirm your email.</PocMuted>
              </div>
              <p className={styles.note}>
                Sent to <strong>{shopAuth.signupEmail}</strong>
              </p>
              <button
                type="button"
                className={styles.linkish}
                disabled={resendCooldownActive}
                onClick={() => patchShopAuth({ verifyResendCooldownUntil: Date.now() + 60_000 })}
              >
                {resendCooldownActive ? `Resend link (${secondsLeft}s)` : "Resend link"}
              </button>
              <p className={styles.note}>Prototype: confirmation isn’t emailed — click below once you&apos;re ready.</p>
              <PocButton type="button" fullWidth onClick={() => advanceShopPastEmailVerified(shopAuth.signupEmail)}>
                I&apos;ve confirmed my email
              </PocButton>
              <div className={styles.backRow}>
                <PocButton
                  type="button"
                  variant="secondary"
                  className={styles.backBtn}
                  onClick={() => {
                    patchShopAuth({ signupDuplicateEmail: false });
                    goPhase("create_account");
                  }}
                >
                  Back
                </PocButton>
              </div>
            </div>
          ) : null}

          {phase === "create_store_profile" ? (
            <form
              className={styles.fieldStack}
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const shopName = String(fd.get("shopName") ?? "").trim();
                const addressLine1 = String(fd.get("addressLine1") ?? "").trim();
                const city = String(fd.get("city") ?? "").trim();
                const state = String(fd.get("state") ?? "").trim();
                const postalCode = String(fd.get("postalCode") ?? "").trim();
                const logoUrl = String(fd.get("logoUrl") ?? "").trim();
                if (!shopName || !addressLine1) return;
                patchShopProfile({
                  shopName,
                  addressLine1,
                  city,
                  state,
                  postalCode,
                  logoUrl: logoUrl || session.profile.logoUrl,
                });
                patchShopAuth({ ftuePhase: "payment_check" });
              }}
            >
              <div className={styles.titleBlock}>
                <PocH1>Create store profile</PocH1>
                <PocMuted>Name, logo (optional), and address.</PocMuted>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="ftue-shop-name">
                  Store name
                </label>
                <PocInput id="ftue-shop-name" name="shopName" required placeholder="Trailhead Cycles" defaultValue={session.profile.shopName} />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="ftue-logo-url">
                  Logo URL (optional)
                </label>
                <PocInput id="ftue-logo-url" name="logoUrl" type="url" placeholder="https://…" defaultValue={session.profile.logoUrl} />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="ftue-address">
                  Address
                </label>
                <PocInput
                  id="ftue-address"
                  name="addressLine1"
                  required
                  placeholder="Street, suite"
                  defaultValue={session.profile.addressLine1}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="ftue-city">
                  City
                </label>
                <PocInput id="ftue-city" name="city" required defaultValue={session.profile.city} />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="ftue-state">
                  State / region
                </label>
                <PocInput id="ftue-state" name="state" required placeholder="OR" defaultValue={session.profile.state} />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="ftue-postal">
                  Postal code
                </label>
                <PocInput id="ftue-postal" name="postalCode" required defaultValue={session.profile.postalCode} />
              </div>
              <PocButton type="submit" fullWidth>
                Continue
              </PocButton>
              <div className={styles.backRow}>
                <PocButton type="button" variant="secondary" className={styles.backBtn} onClick={() => goPhase("verify_email")}>
                  Back
                </PocButton>
              </div>
            </form>
          ) : null}

          {phase === "payment_check" ? (
            <div className={styles.fieldStack}>
              <div className={styles.titleBlock}>
                <PocH1>Payment system</PocH1>
                <PocMuted>Receive payouts when rentals complete.</PocMuted>
              </div>
              <p className={styles.heroQuestion}>Do you have a payment system to connect?</p>
              <div className={styles.buttonStack}>
                <PocButton type="button" fullWidth onClick={() => goPhase("payment_connect")}>
                  Yes
                </PocButton>
                <PocButton type="button" variant="secondary" fullWidth onClick={() => goPhase("payment_skip")}>
                  Not yet
                </PocButton>
              </div>
              <div className={styles.backRow}>
                <PocButton type="button" variant="secondary" className={styles.backBtn} onClick={() => goPhase("create_store_profile")}>
                  Back
                </PocButton>
              </div>
            </div>
          ) : null}

          {phase === "payment_connect" ? (
            <div className={styles.fieldStack}>
              <div className={styles.titleBlock}>
                <PocH1>Select payment system</PocH1>
                <PocMuted>Mock OAuth — choose a provider to continue.</PocMuted>
              </div>
              <div className={styles.paymentRow}>
                <PocButton type="button" variant="secondary" fullWidth onClick={() => connectPayment("stripe")}>
                  Stripe
                </PocButton>
                <PocButton type="button" variant="secondary" fullWidth onClick={() => connectPayment("square")}>
                  Square
                </PocButton>
              </div>
              <div className={styles.backRow}>
                <PocButton type="button" variant="secondary" className={styles.backBtn} onClick={() => goPhase("payment_check")}>
                  Back
                </PocButton>
              </div>
            </div>
          ) : null}

          {phase === "payment_skip" ? (
            <div className={styles.fieldStack}>
              <div className={styles.titleBlock}>
                <PocH1>Set up payment later</PocH1>
                <PocMuted>
                  Your storefront can finish setup while you prepare. Rentals can&apos;t complete until payouts are connected.
                </PocMuted>
              </div>
              <p className={styles.note}>
                We&apos;ll show a reminder banner on your dashboard until you connect Stripe or Square.
              </p>
              <PocButton type="button" fullWidth onClick={() => goPhase("inventory_check")}>
                Continue
              </PocButton>
              <div className={styles.backRow}>
                <PocButton type="button" variant="secondary" className={styles.backBtn} onClick={() => goPhase("payment_check")}>
                  Back
                </PocButton>
              </div>
            </div>
          ) : null}

          {phase === "inventory_check" ? (
            <div className={styles.fieldStack}>
              <div className={styles.titleBlock}>
                <PocH1>Bike inventory</PocH1>
                <PocMuted>List at least one bike to take bookings.</PocMuted>
              </div>
              <p className={styles.heroQuestion}>Are you ready to add your bike inventory?</p>
              <div className={styles.buttonStack}>
                <PocButton
                  type="button"
                  fullWidth
                  onClick={() => {
                    completeShopSignupToDashboard();
                    router.push("/shop/inventory/new");
                  }}
                >
                  Yes — add bikes
                </PocButton>
                <PocButton type="button" variant="secondary" fullWidth onClick={() => goPhase("inventory_skip")}>
                  Not yet
                </PocButton>
              </div>
            </div>
          ) : null}

          {phase === "inventory_skip" ? (
            <div className={styles.fieldStack}>
              <div className={styles.titleBlock}>
                <PocH1>Add bikes later</PocH1>
                <PocMuted>You can publish your fleet from the dashboard checklist.</PocMuted>
              </div>
              <p className={styles.note}>Bookings stay blocked until there&apos;s at least one active bike listing.</p>
              <PocButton
                type="button"
                fullWidth
                onClick={() => {
                  completeShopSignupToDashboard();
                  router.push("/shop");
                }}
              >
                Go to store dashboard
              </PocButton>
              <div className={styles.backRow}>
                <PocButton type="button" variant="secondary" className={styles.backBtn} onClick={() => goPhase("inventory_check")}>
                  Back
                </PocButton>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
