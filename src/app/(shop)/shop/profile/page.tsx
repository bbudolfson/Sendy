"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PocButton, PocH1, PocInput } from "@/components/poc-ui";
import { getMyShopWorkspace, updateMyShopProfile } from "@/app/actions/shops";
import { useShopSession } from "@/context/shop-session";
import { useSupabase } from "@/context/supabase-provider";
import pageStyles from "../shop-pages.module.css";
import styles from "./profile-page.module.css";

export default function ShopProfilePage() {
  const router = useRouter();
  const { configured, user, profile } = useSupabase();
  const { session, patchShopProfile, loadWorkspace, profileCompletion } = useShopSession();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!configured || !user || profile?.role !== "shop") return;
    getMyShopWorkspace().then((workspace) => {
      if (workspace) loadWorkspace(workspace);
    });
  }, [configured, user, profile?.role, loadWorkspace]);

  const formKey = [
    session.profile.id,
    session.profile.shopName,
    session.profile.addressLine1,
    session.profile.city,
  ].join("|");

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
          key={formKey}
          className={styles.form}
          onSubmit={async (event) => {
            event.preventDefault();
            setSaveError(null);
            const form = new FormData(event.currentTarget);
            const updatedProfile = {
              ...session.profile,
              shopName: String(form.get("shopName") ?? ""),
              websiteUrl: String(form.get("websiteUrl") ?? ""),
              shopEmail: String(form.get("shopEmail") ?? ""),
              supportPhone: String(form.get("supportPhone") ?? ""),
              addressLine1: String(form.get("addressLine1") ?? ""),
              city: String(form.get("city") ?? ""),
              state: String(form.get("state") ?? ""),
              postalCode: String(form.get("postalCode") ?? ""),
            };
            patchShopProfile(updatedProfile);

            if (configured) {
              setSaving(true);
              const result = await updateMyShopProfile(updatedProfile);
              setSaving(false);
              if (!result.ok) {
                setSaveError(result.error ?? "Could not save profile.");
                return;
              }
              const workspace = await getMyShopWorkspace();
              if (workspace) loadWorkspace(workspace);
            }

            router.push("/shop");
          }}
        >
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

          <div className={styles.fieldPair}>
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

          <div className={styles.fieldPair}>
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
          </div>

          <div className={styles.footer}>
            {saveError ? (
              <p role="alert" className={pageStyles.mutedText}>
                {saveError}
              </p>
            ) : null}
            <PocButton type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </PocButton>
          </div>
        </form>
      </div>
    </div>
  );
}
