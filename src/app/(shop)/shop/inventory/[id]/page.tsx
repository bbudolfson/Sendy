"use client";

import { PocButton, PocButtonLink, PocCard, PocH1, PocInput, PocLabel, PocSelect, PocStack, PocTextarea } from "@/components/poc-ui";
import { useShopSession } from "@/context/shop-session";
import styles from "../../shop-pages.module.css";

export default function InventoryBikeDetailPage({ params }: { params: { id: string } }) {
  const { session, upsertBikeDraft } = useShopSession();
  const bike = session.inventory.find((item) => item.id === params.id);
  if (!bike) {
    return (
      <div className={styles.page}>
        <div className={styles.shopPageHeaderRow}>
          <PocH1>Bike not found</PocH1>
          <div className={styles.shopPageHeaderActions}>
            <PocButtonLink href="/shop/inventory" variant="secondary">
              Back to inventory
            </PocButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.shopPageHeaderRow}>
        <PocH1>Edit bike</PocH1>
        <div className={styles.shopPageHeaderActions}>
          <PocButtonLink href="/shop/inventory" variant="secondary">
            Back to fleet
          </PocButtonLink>
        </div>
      </div>
      <PocCard>
        <PocStack gap="md">
          <img src={bike.imageUrl} alt={bike.title} className={styles.image} />
          <form
            className={styles.twoCol}
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              upsertBikeDraft({
                ...bike,
                title: String(form.get("title") ?? ""),
                brand: String(form.get("brand") ?? ""),
                model: String(form.get("model") ?? ""),
                type: String(form.get("type") ?? "Mountain") as typeof bike.type,
                size: String(form.get("size") ?? ""),
                imageUrl: String(form.get("imageUrl") ?? ""),
                description: String(form.get("description") ?? ""),
                status: String(form.get("status") ?? "active") as typeof bike.status,
              });
            }}
          >
            <div>
              <PocLabel>Listing title</PocLabel>
              <PocInput name="title" defaultValue={bike.title} />
            </div>
            <div>
              <PocLabel>Status</PocLabel>
              <PocSelect name="status" defaultValue={bike.status}>
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </PocSelect>
            </div>
            <div>
              <PocLabel>Brand</PocLabel>
              <PocInput name="brand" defaultValue={bike.brand} />
            </div>
            <div>
              <PocLabel>Model</PocLabel>
              <PocInput name="model" defaultValue={bike.model} />
            </div>
            <div>
              <PocLabel>Type</PocLabel>
              <PocSelect name="type" defaultValue={bike.type}>
                <option>Road</option>
                <option>Mountain</option>
                <option>Gravel</option>
                <option>E-Bike</option>
              </PocSelect>
            </div>
            <div>
              <PocLabel>Size</PocLabel>
              <PocInput name="size" defaultValue={bike.size} />
            </div>
            <div className={styles.fullSpan}>
              <PocLabel>Image URL</PocLabel>
              <PocInput name="imageUrl" defaultValue={bike.imageUrl} />
            </div>
            <div className={styles.fullSpan}>
              <PocLabel>Description</PocLabel>
              <PocTextarea name="description" defaultValue={bike.description} />
            </div>
            <div className={`${styles.actions} ${styles.fullSpan}`}>
              <PocButton type="submit">Save bike</PocButton>
              <PocButtonLink href={`/shop/inventory/${bike.id}/availability`} variant="secondary">
                Availability
              </PocButtonLink>
              <PocButtonLink href={`/shop/inventory/${bike.id}/rates`} variant="secondary">
                Rates
              </PocButtonLink>
            </div>
          </form>
        </PocStack>
      </PocCard>
    </div>
  );
}
