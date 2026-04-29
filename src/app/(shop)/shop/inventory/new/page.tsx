"use client";

import { useRouter } from "next/navigation";
import { PocButton, PocCard, PocH1, PocInput, PocLabel, PocSelect, PocStack, PocTextarea } from "@/components/poc-ui";
import { useRenterSession } from "@/context/renter-session";
import type { ShopBike } from "@/lib/domain/types";
import styles from "../../renter-pages.module.css";

export default function NewBikePage() {
  const router = useRouter();
  const { session, upsertBikeDraft } = useRenterSession();

  return (
    <div className={styles.page}>
      <PocCard>
        <PocStack gap="md">
          <PocH1>Add bike</PocH1>
          <form
            className={styles.twoCol}
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const id = `shop-bike-${Date.now()}`;
              const bike: ShopBike = {
                id,
                shopId: session.profile.id,
                title: String(form.get("title") ?? ""),
                brand: String(form.get("brand") ?? ""),
                model: String(form.get("model") ?? ""),
                type: String(form.get("type") ?? "Mountain") as ShopBike["type"],
                size: String(form.get("size") ?? ""),
                description: String(form.get("description") ?? ""),
                imageUrl: String(form.get("imageUrl") ?? ""),
                status: "active",
              };
              upsertBikeDraft(bike);
              router.push(`/shop/inventory/${id}`);
            }}
          >
            <div>
              <PocLabel>Listing title</PocLabel>
              <PocInput name="title" required />
            </div>
            <div>
              <PocLabel>Brand</PocLabel>
              <PocInput name="brand" required />
            </div>
            <div>
              <PocLabel>Model</PocLabel>
              <PocInput name="model" required />
            </div>
            <div>
              <PocLabel>Type</PocLabel>
              <PocSelect name="type" defaultValue="Mountain">
                <option>Road</option>
                <option>Mountain</option>
                <option>Gravel</option>
                <option>E-Bike</option>
              </PocSelect>
            </div>
            <div>
              <PocLabel>Size</PocLabel>
              <PocInput name="size" required placeholder="M / 54 / L" />
            </div>
            <div>
              <PocLabel>Image URL</PocLabel>
              <PocInput name="imageUrl" required />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <PocLabel>Description</PocLabel>
              <PocTextarea name="description" required />
            </div>
            <div className={styles.actions} style={{ gridColumn: "1 / -1" }}>
              <PocButton type="submit">Create bike</PocButton>
            </div>
          </form>
        </PocStack>
      </PocCard>
    </div>
  );
}
