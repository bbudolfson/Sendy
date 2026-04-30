"use client";

import { useEffect, useState } from "react";
import {
  PocButton,
  PocButtonLink,
  PocH1,
  PocH2,
  PocInput,
  PocLabel,
  PocSelect,
  PocTextarea,
} from "@/components/poc-ui";
import { InventoryPhotoColumn } from "@/components/ui/InventoryPhotoColumn/InventoryPhotoColumn";
import { useShopSession } from "@/context/shop-session";
import { getShopBikeGallery } from "@/lib/dummy-data";
import pageStyles from "../../shop-pages.module.css";
import layoutStyles from "../new/new-bike-page.module.css";

export default function InventoryBikeDetailPage({ params }: { params: { id: string } }) {
  const { session, upsertBikeDraft } = useShopSession();
  const bike = session.inventory.find((item) => item.id === params.id);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (!bike) return;
    setPhotos([...getShopBikeGallery(bike.id)]);
  }, [bike?.id]);

  if (!bike) {
    return (
      <div className={pageStyles.page}>
        <div className={pageStyles.shopPageHeaderRow}>
          <PocH1>Bike not found</PocH1>
          <div className={pageStyles.shopPageHeaderActions}>
            <PocButtonLink href="/shop/inventory" variant="secondary">
              Back to inventory
            </PocButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.shopPageHeaderRow}>
        <PocH1>Edit bike</PocH1>
        <div className={pageStyles.shopPageHeaderActions}>
          <PocButtonLink href="/shop/inventory" variant="secondary">
            Back to fleet
          </PocButtonLink>
        </div>
      </div>

      <div className={`${pageStyles.pageWide} ${layoutStyles.card}`}>
        <PocH2>{bike.title}</PocH2>
        <form
          className={layoutStyles.layout}
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
              imageUrl: photos[0] ?? bike.imageUrl,
              photoUrls: photos.length > 0 ? photos : undefined,
              description: String(form.get("description") ?? ""),
              status: String(form.get("status") ?? "active") as typeof bike.status,
            });
          }}
        >
          <InventoryPhotoColumn photos={photos} onPhotosChange={setPhotos} />

          <div className={layoutStyles.fields}>
            <div>
              <PocLabel htmlFor="edit-bike-title">Listing title</PocLabel>
              <PocInput id="edit-bike-title" name="title" defaultValue={bike.title} />
            </div>
            <div>
              <PocLabel htmlFor="edit-bike-status">Status</PocLabel>
              <PocSelect id="edit-bike-status" name="status" defaultValue={bike.status}>
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </PocSelect>
            </div>
            <div>
              <PocLabel htmlFor="edit-bike-brand">Brand</PocLabel>
              <PocInput id="edit-bike-brand" name="brand" defaultValue={bike.brand} />
            </div>
            <div>
              <PocLabel htmlFor="edit-bike-model">Model</PocLabel>
              <PocInput id="edit-bike-model" name="model" defaultValue={bike.model} />
            </div>
            <div>
              <PocLabel htmlFor="edit-bike-type">Type</PocLabel>
              <PocSelect id="edit-bike-type" name="type" defaultValue={bike.type}>
                <option>Road</option>
                <option>Mountain</option>
                <option>Gravel</option>
                <option>E-Bike</option>
              </PocSelect>
            </div>
            <div>
              <PocLabel htmlFor="edit-bike-size">Size</PocLabel>
              <PocInput id="edit-bike-size" name="size" defaultValue={bike.size} />
            </div>
            <div>
              <PocLabel htmlFor="edit-bike-description">Description</PocLabel>
              <PocTextarea id="edit-bike-description" name="description" defaultValue={bike.description} />
            </div>
            <div className={layoutStyles.footer}>
              <PocButtonLink href="/shop/inventory" variant="secondary">
                Cancel
              </PocButtonLink>
              <PocButton type="submit">Save bike</PocButton>
              <PocButtonLink href={`/shop/inventory/${bike.id}/availability`} variant="secondary">
                Availability
              </PocButtonLink>
              <PocButtonLink href={`/shop/inventory/${bike.id}/rates`} variant="secondary">
                Rates
              </PocButtonLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
