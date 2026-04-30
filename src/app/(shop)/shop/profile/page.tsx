"use client";

import { useState } from "react";
import { PocButton, PocH1, PocMuted, PocInput } from "@/components/poc-ui";
import { useShopSession } from "@/context/shop-session";
import pageStyles from "../shop-pages.module.css";
import styles from "./profile-page.module.css";

export default function ShopProfilePage() {
  const { session, patchShopProfile, profileCompletion } = useShopSession();
  const [saved, setSaved] = useState(false);

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.shopPageHeaderRow}>
        <PocH1>Shop profile</PocH1>
        <div className={pageStyles.shopPageHeaderActions}>
          <span className={pageStyles.mutedText}>Completion: {profileCompletion}%</span>
        </div>
      </div>

      <div className={styles.profileCard}>
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            patchShopProfile({
              shopName: String(form.get("shopName") ?? ""),
              websiteUrl: String(form.get("websiteUrl") ?? ""),
              shopEmail: String(form.get("shopEmail") ?? ""),
              supportPhone: String(form.get("supportPhone") ?? ""),
              addressLine1: String(form.get("addressLine1") ?? ""),
              city: String(form.get("city") ?? ""),
              state: String(form.get("state") ?? ""),
              postalCode: String(form.get("postalCode") ?? ""),
            });
            setSaved(true);
          }}
        >
          <div>
            <label className={styles.logoDropzone} htmlFor="shop-profile-logo">
              <input id="shop-profile-logo" type="file" accept="image/*" aria-label="Upload your logo" />
              Upload your logo
            </label>
          </div>

          <div>
            <label className={styles.profileLabel} htmlFor="shop-profile-name">
              Shop name
            </label>
            <PocInput
              id="shop-profile-name"
              name="shopName"
              placeholder="Santa Cruz Nomad"
              defaultValue={session.profile.shopName}
            />
          </div>

          <div>
            <label className={styles.profileLabel} htmlFor="shop-profile-website">
              Website
            </label>
            <PocInput
              id="shop-profile-website"
              name="websiteUrl"
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="https://yoursite.com"
              defaultValue={session.profile.websiteUrl}
            />
          </div>

          <div>
            <label className={styles.profileLabel} htmlFor="shop-profile-email">
              Shop email
            </label>
            <PocInput
              id="shop-profile-email"
              name="shopEmail"
              type="email"
              autoComplete="email"
              placeholder="contact@yourshop.com"
              defaultValue={session.profile.shopEmail}
            />
          </div>

          <div>
            <label className={styles.profileLabel} htmlFor="shop-profile-phone">
              Shop phone
            </label>
            <PocInput
              id="shop-profile-phone"
              name="supportPhone"
              type="tel"
              autoComplete="tel"
              placeholder="(555) 555-0100"
              defaultValue={session.profile.supportPhone}
            />
          </div>

          <div>
            <label className={styles.profileLabel} htmlFor="shop-profile-address">
              Address
            </label>
            <PocInput id="shop-profile-address" name="addressLine1" placeholder="Street, suite" defaultValue={session.profile.addressLine1} />
          </div>

          <div>
            <label className={styles.profileLabel} htmlFor="shop-profile-city">
              City
            </label>
            <PocInput id="shop-profile-city" name="city" placeholder="City" defaultValue={session.profile.city} />
          </div>

          <div>
            <label className={styles.profileLabel} htmlFor="shop-profile-state">
              State
            </label>
            <PocInput id="shop-profile-state" name="state" placeholder="CA" defaultValue={session.profile.state} />
          </div>

          <div>
            <label className={styles.profileLabel} htmlFor="shop-profile-zip">
              Zip
            </label>
            <PocInput id="shop-profile-zip" name="postalCode" placeholder="97701" defaultValue={session.profile.postalCode} />
          </div>

          <div className={styles.footer}>
            {saved ? <PocMuted>Profile updated.</PocMuted> : null}
            <PocButton type="submit">Save</PocButton>
          </div>
        </form>
      </div>
    </div>
  );
}
