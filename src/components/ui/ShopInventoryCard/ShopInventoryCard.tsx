import React from "react";
import { PocInput } from "@/components/poc-ui";
import "./ShopInventoryCard.css";

function MoreVerticalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="4" r="1.25" fill="currentColor" />
      <circle cx="10" cy="10" r="1.25" fill="currentColor" />
      <circle cx="10" cy="16" r="1.25" fill="currentColor" />
    </svg>
  );
}

function closeOverflowMenu(event: React.MouseEvent<HTMLElement>) {
  const details = event.currentTarget.closest("details");
  if (details) details.open = false;
}

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
      <header className="sendy-shop-inventory-card__header">
        <h3 className="sendy-shop-inventory-card__title">{title}</h3>
        <details className="sendy-shop-inventory-card__overflow">
          <summary className="sendy-shop-inventory-card__overflow-trigger" aria-label="Bike actions">
            <MoreVerticalIcon />
          </summary>
          <div className="sendy-shop-inventory-card__overflow-menu" role="menu">
            {!isEdit ? (
              <>
                <button
                  type="button"
                  role="menuitem"
                  className="sendy-shop-inventory-card__overflow-item"
                  onClick={(event) => {
                    onEdit?.();
                    closeOverflowMenu(event);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="sendy-shop-inventory-card__overflow-item"
                  onClick={(event) => {
                    onDuplicate?.();
                    closeOverflowMenu(event);
                  }}
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="sendy-shop-inventory-card__overflow-item sendy-shop-inventory-card__overflow-item--destructive"
                  onClick={(event) => {
                    onRemove?.();
                    closeOverflowMenu(event);
                  }}
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  role="menuitem"
                  className="sendy-shop-inventory-card__overflow-item"
                  onClick={(event) => {
                    onCancel?.();
                    closeOverflowMenu(event);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="sendy-shop-inventory-card__overflow-item"
                  onClick={(event) => {
                    onSave?.();
                    closeOverflowMenu(event);
                  }}
                >
                  Save
                </button>
              </>
            )}
          </div>
        </details>
      </header>
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
        </div>
      </div>
    </article>
  );
}

export default ShopInventoryCard;
