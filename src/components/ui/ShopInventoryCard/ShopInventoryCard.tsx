import React from "react";
import { PocInput } from "@/components/poc-ui";
import { Button } from "@/components/ui/Button/Button";
import "./ShopInventoryCard.css";

type ShopInventoryCardMode = "view" | "edit";

type ShopInventoryCardProps = {
  mode?: ShopInventoryCardMode;
  imageUrl: string;
  imageAlt?: string;
  title: string;
  bikeLine: string;
  sizeLine: string;
  specsLine: string;
  rateLine: string;
  bikeValue?: string;
  sizeValue?: string;
  specsValue?: string;
  rateValue?: string;
  onBikeValueChange?: (value: string) => void;
  onSizeValueChange?: (value: string) => void;
  onSpecsValueChange?: (value: string) => void;
  onRateValueChange?: (value: string) => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
};

export function ShopInventoryCard({
  mode = "view",
  imageUrl,
  imageAlt,
  title,
  bikeLine,
  sizeLine,
  specsLine,
  rateLine,
  bikeValue = "",
  sizeValue = "",
  specsValue = "",
  rateValue = "",
  onBikeValueChange,
  onSizeValueChange,
  onSpecsValueChange,
  onRateValueChange,
  onEdit,
  onDuplicate,
  onRemove,
  onCancel,
  onSave,
}: ShopInventoryCardProps) {
  const isEdit = mode === "edit";

  return (
    <article className="sendy-shop-inventory-card">
      <h3 className="sendy-shop-inventory-card__title">{title}</h3>
      <div className="sendy-shop-inventory-card__main">
        <div className="sendy-shop-inventory-card__image-wrap">
          <img className="sendy-shop-inventory-card__image" src={imageUrl} alt={imageAlt ?? title} />
        </div>
        <div className="sendy-shop-inventory-card__content">
          {!isEdit && (
            <div className="sendy-shop-inventory-card__detail-lines">
              <p>{bikeLine}</p>
              <p>{sizeLine}</p>
              <p>{specsLine}</p>
              <p>{rateLine}</p>
            </div>
          )}

          {isEdit && (
            <div className="sendy-shop-inventory-card__form-grid">
              <label className="sendy-shop-inventory-card__field">
                <span>Bike</span>
                <PocInput
                  className="sendy-shop-inventory-card__input"
                  value={bikeValue}
                  onChange={(event) => onBikeValueChange?.(event.currentTarget.value)}
                />
              </label>
              <label className="sendy-shop-inventory-card__field">
                <span>Size</span>
                <PocInput
                  className="sendy-shop-inventory-card__input"
                  value={sizeValue}
                  onChange={(event) => onSizeValueChange?.(event.currentTarget.value)}
                />
              </label>
              <label className="sendy-shop-inventory-card__field">
                <span>Specs</span>
                <PocInput
                  className="sendy-shop-inventory-card__input"
                  value={specsValue}
                  onChange={(event) => onSpecsValueChange?.(event.currentTarget.value)}
                />
              </label>
              <label className="sendy-shop-inventory-card__field">
                <span>Rate</span>
                <PocInput
                  className="sendy-shop-inventory-card__input"
                  value={rateValue}
                  onChange={(event) => onRateValueChange?.(event.currentTarget.value)}
                />
              </label>
            </div>
          )}

          <div className="sendy-shop-inventory-card__actions">
            {!isEdit && (
              <>
                <Button type="button" variant="destructive" onClick={onRemove}>
                  Remove
                </Button>
                <Button type="button" variant="secondary" onClick={onEdit}>
                  Edit
                </Button>
                <Button type="button" onClick={onDuplicate}>
                  Duplicate
                </Button>
              </>
            )}
            {isEdit && (
              <>
                <Button type="button" variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="button" onClick={onSave}>
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default ShopInventoryCard;
