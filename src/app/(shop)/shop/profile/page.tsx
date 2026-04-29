"use client";

import { useState } from "react";
import { PocButton, PocCard, PocH1, PocInput, PocLabel, PocMuted, PocStack, PocTextarea } from "@/components/poc-ui";
import { useRenterSession } from "@/context/renter-session";
import styles from "../renter-pages.module.css";

export default function ShopProfilePage() {
  const { session, patchShopProfile, profileCompletion, addDeliveryZone } = useRenterSession();
  const [saved, setSaved] = useState(false);

  return (
    <div className={styles.page}>
      <PocCard>
        <PocStack gap="md">
          <PocH1>Shop profile</PocH1>
          <PocMuted>Completion: {profileCompletion}%</PocMuted>
          <form
            className={styles.twoCol}
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              patchShopProfile({
                ownerName: String(form.get("ownerName") ?? ""),
                email: String(form.get("email") ?? ""),
                shopName: String(form.get("shopName") ?? ""),
                addressLine1: String(form.get("addressLine1") ?? ""),
                city: String(form.get("city") ?? ""),
                state: String(form.get("state") ?? ""),
                postalCode: String(form.get("postalCode") ?? ""),
                supportPhone: String(form.get("supportPhone") ?? ""),
                logoUrl: String(form.get("logoUrl") ?? ""),
                serviceAreaNotes: String(form.get("serviceAreaNotes") ?? ""),
              });
              setSaved(true);
            }}
          >
            <div>
              <PocLabel>Owner name</PocLabel>
              <PocInput name="ownerName" defaultValue={session.profile.ownerName} />
            </div>
            <div>
              <PocLabel>Owner email</PocLabel>
              <PocInput name="email" type="email" defaultValue={session.profile.email} />
            </div>
            <div>
              <PocLabel>Shop name</PocLabel>
              <PocInput name="shopName" defaultValue={session.profile.shopName} />
            </div>
            <div>
              <PocLabel>Support phone</PocLabel>
              <PocInput name="supportPhone" defaultValue={session.profile.supportPhone} />
            </div>
            <div>
              <PocLabel>Address line 1</PocLabel>
              <PocInput name="addressLine1" defaultValue={session.profile.addressLine1} />
            </div>
            <div>
              <PocLabel>City</PocLabel>
              <PocInput name="city" defaultValue={session.profile.city} />
            </div>
            <div>
              <PocLabel>State</PocLabel>
              <PocInput name="state" defaultValue={session.profile.state} />
            </div>
            <div>
              <PocLabel>Postal code</PocLabel>
              <PocInput name="postalCode" defaultValue={session.profile.postalCode} />
            </div>
            <div>
              <PocLabel>Logo URL</PocLabel>
              <PocInput name="logoUrl" defaultValue={session.profile.logoUrl} />
            </div>
            <div>
              <PocLabel>Logo upload (prototype)</PocLabel>
              <PocInput type="file" accept="image/*" />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <PocLabel>Service area notes</PocLabel>
              <PocTextarea name="serviceAreaNotes" defaultValue={session.profile.serviceAreaNotes} />
            </div>
            <div style={{ gridColumn: "1 / -1" }} className={styles.actions}>
              <PocButton type="submit">Save profile</PocButton>
              {saved ? <PocMuted>Profile updated.</PocMuted> : null}
            </div>
          </form>
        </PocStack>
      </PocCard>
      <PocCard>
        <PocStack gap="sm">
          <PocH1>Delivery zones</PocH1>
          <form
            className={styles.actions}
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const label = String(form.get("label") ?? "").trim();
              const notes = String(form.get("notes") ?? "").trim();
              if (!label) return;
              addDeliveryZone({
                id: `zone-${Date.now()}`,
                shopId: session.profile.id,
                label,
                notes,
              });
              event.currentTarget.reset();
            }}
          >
            <PocInput name="label" placeholder="New zone or trailhead" />
            <PocInput name="notes" placeholder="Notes" />
            <PocButton type="submit" variant="secondary">
              Add zone
            </PocButton>
          </form>
          <ul className={styles.list}>
            {session.deliveryZones.map((zone) => (
              <li key={zone.id} className={styles.listItem}>
                <p>{zone.label}</p>
                <p className={styles.mutedText}>{zone.notes || "No notes"}</p>
              </li>
            ))}
          </ul>
        </PocStack>
      </PocCard>
    </div>
  );
}
