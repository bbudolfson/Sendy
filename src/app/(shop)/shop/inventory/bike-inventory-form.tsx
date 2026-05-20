"use client";

import { useState } from "react";
import {
  PocButton,
  PocInput,
  PocLabel,
  PocSelect,
  PocTextarea,
} from "@/components/poc-ui";
import { InventoryPhotoColumn } from "@/components/ui/InventoryPhotoColumn/InventoryPhotoColumn";
import type { ShopBike } from "@/lib/domain/types";
import styles from "./new/new-bike-page.module.css";

export type BikeInventoryFormValues = {
  brand: string;
  model: string;
  size: string;
  type: ShopBike["type"];
  description: string;
  dailyRate: number;
  halfDayRate: number;
  photos: string[];
};

type BikeInventoryFormDefaults = {
  brand?: string;
  model?: string;
  size?: string;
  type?: ShopBike["type"];
  description?: string;
  dailyRate?: string;
  halfDayRate?: string;
};

type BikeInventoryFormProps = {
  initialPhotos?: string[];
  defaultValues?: BikeInventoryFormDefaults;
  error?: string | null;
  pending?: boolean;
  submitLabel?: string;
  onSubmit: (values: BikeInventoryFormValues) => void | Promise<void>;
  onCancel: () => void;
};

export function BikeInventoryForm({
  initialPhotos = [],
  defaultValues = {},
  error = null,
  pending = false,
  submitLabel = "Save",
  onSubmit,
  onCancel,
}: BikeInventoryFormProps) {
  const [photos, setPhotos] = useState<string[]>(initialPhotos);

  return (
    <form
      className={styles.layout}
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        await onSubmit({
          brand: String(form.get("brand") ?? "").trim(),
          model: String(form.get("model") ?? "").trim(),
          size: String(form.get("size") ?? "").trim(),
          type: String(form.get("type") ?? "Mountain") as ShopBike["type"],
          description: String(form.get("description") ?? "").trim(),
          dailyRate: parseMoney(form.get("dailyRate")),
          halfDayRate: parseMoney(form.get("halfDayRate")),
          photos,
        });
      }}
    >
      <InventoryPhotoColumn photos={photos} onPhotosChange={setPhotos} />

      <div className={styles.fields}>
        {error ? <p role="alert">{error}</p> : null}
        <div>
          <PocLabel htmlFor="bike-brand">Brand</PocLabel>
          <PocInput
            id="bike-brand"
            name="brand"
            required
            placeholder="Santa Cruz"
            defaultValue={defaultValues.brand}
          />
        </div>
        <div>
          <PocLabel htmlFor="bike-model">Model</PocLabel>
          <PocInput
            id="bike-model"
            name="model"
            required
            placeholder="Nomad"
            defaultValue={defaultValues.model}
          />
        </div>
        <div className={styles.fieldPair}>
          <div>
            <PocLabel htmlFor="bike-size">Size</PocLabel>
            <PocSelect id="bike-size" name="size" required defaultValue={defaultValues.size ?? "Large"}>
              <option>X-Small</option>
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
              <option>X-Large</option>
              <option>XX-Large</option>
            </PocSelect>
          </div>
          <div>
            <PocLabel htmlFor="bike-type">Type</PocLabel>
            <PocSelect id="bike-type" name="type" defaultValue={defaultValues.type ?? "Mountain"}>
              <option>Road</option>
              <option>Mountain</option>
              <option>Gravel</option>
              <option>E-Bike</option>
            </PocSelect>
          </div>
        </div>
        <div>
          <PocLabel htmlFor="bike-description">Description</PocLabel>
          <PocTextarea
            id="bike-description"
            name="description"
            placeholder="$200 Full Day | $125 Half Day"
            rows={3}
            defaultValue={defaultValues.description}
          />
        </div>
        <div className={styles.fieldPair}>
          <div>
            <PocLabel htmlFor="bike-daily">Full day rate</PocLabel>
            <PocInput
              id="bike-daily"
              name="dailyRate"
              inputMode="decimal"
              placeholder="$200"
              required
              defaultValue={defaultValues.dailyRate}
            />
          </div>
          <div>
            <PocLabel htmlFor="bike-half">Half day rate</PocLabel>
            <PocInput
              id="bike-half"
              name="halfDayRate"
              inputMode="decimal"
              placeholder="$125"
              required
              defaultValue={defaultValues.halfDayRate}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <PocButton type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </PocButton>
          <PocButton type="submit" disabled={pending}>
            {pending ? "Saving…" : submitLabel}
          </PocButton>
        </div>
      </div>
    </form>
  );
}

function parseMoney(raw: unknown): number {
  const cleaned = String(raw ?? "")
    .replace(/[^\d.-]/g, "")
    .trim();
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

export function bikeToFormDefaults(
  bike: ShopBike,
  rates?: { dailyRate: number; halfDayRate?: number },
): BikeInventoryFormDefaults {
  const half =
    rates?.halfDayRate !== undefined
      ? rates.halfDayRate
      : rates?.dailyRate
        ? Math.round(rates.dailyRate * 0.625)
        : undefined;

  return {
    brand: bike.brand,
    model: bike.model,
    size: bike.size,
    type: bike.type,
    description: bike.description,
    dailyRate: rates?.dailyRate !== undefined ? String(rates.dailyRate) : undefined,
    halfDayRate: half !== undefined ? String(half) : undefined,
  };
}

export function bikePhotoUrls(bike: ShopBike, fallbackGallery: string[] = []): string[] {
  if (bike.photoUrls?.length) return [...bike.photoUrls];
  if (fallbackGallery.length) return [...fallbackGallery];
  return bike.imageUrl ? [bike.imageUrl] : [];
}
