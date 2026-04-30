"use client";

import React, { useCallback, useId, useMemo, useRef, useState } from "react";
import { PocInput } from "@/components/poc-ui";
import { Button } from "@/components/ui/Button/Button";
import { Pill } from "@/components/ui/Pill/Pill";
import { Select } from "@/components/ui/Select/Select";
import {
  formatDisplayDate,
  formatReturnBackPillText,
} from "@/lib/format-display-date";
import "./ShopReservationCard.css";

type ReservationStatus = "pending" | "approved" | "declined";

export type ShopReservationEditDefaults = {
  bikeSize: string;
  helmetSize: string;
  /** `YYYY-MM-DD` for `<input type="date">` */
  pickupDate: string;
  returnDate: string;
};

export type ShopReservationCardProps = {
  bikeTitle: string;
  priceLine: string;
  status: ReservationStatus;
  requestedBy: string;
  email: string;
  phone: string;
  bikeDetailsLine: string;
  pickupLine: string;
  returnLine: string;
  totalChargesLine: string;
  declineReasonLine?: string;
  /** When set with `onEdit`, quick-edit form is prefilled from these values */
  editDefaults?: ShopReservationEditDefaults;
  onEdit?: () => void;
  onApprove?: () => void;
  /** Called after the shop confirms decline in the modal (reason may be empty). */
  onDecline?: (reason: string) => void;
  onPickedUp?: () => void;
};

const FALLBACK_EDIT: ShopReservationEditDefaults = {
  bikeSize: "Large",
  helmetSize: "None",
  pickupDate: "2026-05-03",
  returnDate: "2026-05-06",
};

const BIKE_SIZES = [
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
] as const;
const HELMET_SIZES = ["None", "Helmet", "S", "M", "L", "XL"] as const;

function toPillVariant(
  status: ReservationStatus,
): "error" | "success" | "pending" {
  if (status === "approved") return "success";
  if (status === "declined") return "error";
  return "pending";
}

function toPillLabel(status: ReservationStatus): string {
  if (status === "approved") return "APPROVED";
  if (status === "declined") return "DECLINED";
  return "PENDING";
}

function formatBikeLine(
  title: string,
  bikeSize: string,
  helmetSize: string,
): string {
  const helmet =
    helmetSize === "None"
      ? "No helmet"
      : helmetSize === "Helmet"
        ? "Helmet"
        : `Helmet (${helmetSize})`;
  return `Bike: ${title}, ${bikeSize}, ${helmet}`;
}

function formatPickupLine(iso: string): string {
  const d = formatDisplayDate(iso);
  return d ? `Pickup: ${d}` : "Pickup:";
}

function formatReturnLine(iso: string): string {
  const d = formatDisplayDate(iso);
  return d ? `Return: ${d}` : "Return:";
}

export function ShopReservationCard({
  bikeTitle,
  priceLine,
  status,
  requestedBy,
  email,
  phone,
  bikeDetailsLine: bikeDetailsLineProp,
  pickupLine: pickupLineProp,
  returnLine: returnLineProp,
  totalChargesLine,
  declineReasonLine,
  editDefaults,
  onEdit,
  onApprove,
  onDecline,
  onPickedUp,
}: ShopReservationCardProps) {
  const formId = useId();
  const declineDialogRef = useRef<HTMLDialogElement>(null);
  const declineReasonFieldId = `${formId}-decline-reason`;
  const resolvedDefaults = editDefaults ?? FALLBACK_EDIT;

  const [saved, setSaved] = useState(() => ({
    bikeDetailsLine: bikeDetailsLineProp,
    pickupLine: pickupLineProp,
    returnLine: returnLineProp,
    bikeSize: resolvedDefaults.bikeSize,
    helmetSize: resolvedDefaults.helmetSize,
    pickupDate: resolvedDefaults.pickupDate,
    returnDate: resolvedDefaults.returnDate,
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [bikeSize, setBikeSize] = useState(resolvedDefaults.bikeSize);
  const [helmetSize, setHelmetSize] = useState(resolvedDefaults.helmetSize);
  const [pickupDate, setPickupDate] = useState(resolvedDefaults.pickupDate);
  const [returnDate, setReturnDate] = useState(resolvedDefaults.returnDate);
  const [collapseMode, setCollapseMode] = useState<
    null | "declined" | "picked_up"
  >(null);
  const [declineReasonDraft, setDeclineReasonDraft] = useState("");

  const openEdit = useCallback(() => {
    setBikeSize(saved.bikeSize);
    setHelmetSize(saved.helmetSize);
    setPickupDate(saved.pickupDate);
    setReturnDate(saved.returnDate);
    setIsEditing(true);
    onEdit?.();
  }, [onEdit, saved]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  const saveEdit = useCallback(() => {
    setSaved({
      bikeDetailsLine: formatBikeLine(bikeTitle, bikeSize, helmetSize),
      pickupLine: formatPickupLine(pickupDate),
      returnLine: formatReturnLine(returnDate),
      bikeSize,
      helmetSize,
      pickupDate,
      returnDate,
    });
    setIsEditing(false);
  }, [bikeTitle, bikeSize, helmetSize, pickupDate, returnDate]);

  const showPrimaryFooter = useMemo(
    () =>
      (status === "pending" || status === "approved") &&
      (onDecline || onApprove || onPickedUp || onEdit),
    [onApprove, onDecline, onEdit, onPickedUp, status],
  );

  const openDeclineDialog = useCallback(() => {
    setDeclineReasonDraft("");
    declineDialogRef.current?.showModal();
  }, []);

  const closeDeclineDialog = useCallback(() => {
    declineDialogRef.current?.close();
  }, []);

  const confirmDecline = useCallback(() => {
    onDecline?.(declineReasonDraft.trim());
    declineDialogRef.current?.close();
    setCollapseMode("declined");
  }, [declineReasonDraft, onDecline]);

  const handlePickedUp = useCallback(() => {
    onPickedUp?.();
    setCollapseMode("picked_up");
  }, [onPickedUp]);

  if (collapseMode === "declined" || collapseMode === "picked_up") {
    return (
      <article className="sendy-shop-res-card sendy-shop-res-card--collapsed">
        <div className="sendy-shop-res-card__collapsed-main">
          <h3 className="sendy-shop-res-card__title">{bikeTitle}</h3>
          <p className="sendy-shop-res-card__price">{priceLine}</p>
        </div>
        {collapseMode === "declined" ? (
          <Pill
            variant="error"
            size="sm"
            className="sendy-shop-res-card__collapsed-pill"
          >
            Declined
          </Pill>
        ) : (
          <Pill
            variant="pending"
            size="sm"
            className="sendy-shop-res-card__collapsed-pill sendy-shop-res-card__return-pill"
          >
            {formatReturnBackPillText(saved.returnDate)}
          </Pill>
        )}
      </article>
    );
  }

  return (
    <>
      <dialog
        ref={declineDialogRef}
        className="sendy-shop-res-card__dialog"
        aria-labelledby={`${formId}-decline-title`}
        onClose={() => setDeclineReasonDraft("")}
      >
        <div className="sendy-shop-res-card__dialog-panel">
          <h2
            id={`${formId}-decline-title`}
            className="sendy-shop-res-card__dialog-title"
          >
            Decline this reservation?
          </h2>
          <p className="sendy-shop-res-card__dialog-lede">
            Are you sure you want to decline this request?
          </p>
          <div className="sendy-shop-res-card__dialog-field">
            <label
              className="sendy-shop-res-card__field-label"
              htmlFor={declineReasonFieldId}
            >
              Reason
            </label>
            <textarea
              id={declineReasonFieldId}
              className="sendy-shop-res-card__dialog-textarea"
              rows={4}
              value={declineReasonDraft}
              onChange={(e) => setDeclineReasonDraft(e.currentTarget.value)}
              placeholder="Add a note for your records (optional)"
            />
          </div>
          <div className="sendy-shop-res-card__dialog-actions">
            <Button
              variant="secondary"
              size="md"
              type="button"
              onClick={closeDeclineDialog}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="md"
              type="button"
              onClick={confirmDecline}
            >
              Decline reservation
            </Button>
          </div>
        </div>
      </dialog>

      <article className="sendy-shop-res-card">
        <div className="sendy-shop-res-card__header">
          <div className="sendy-shop-res-card__title-block">
            <h3 className="sendy-shop-res-card__title">{bikeTitle}</h3>
            <p className="sendy-shop-res-card__price">{priceLine}</p>
          </div>
          <Pill
            variant={toPillVariant(status)}
            size="sm"
            className="sendy-shop-res-card__status-pill"
          >
            {toPillLabel(status)}
          </Pill>
        </div>
        <div className="sendy-shop-res-card__body">
          <div className="sendy-shop-res-card__left">
            <p className="sendy-shop-res-card__meta">
              Requested by: <span>{requestedBy}</span>
            </p>
            <p className="sendy-shop-res-card__meta">Email: {email}</p>
            <p className="sendy-shop-res-card__meta">Phone: {phone}</p>
          </div>

          <div className="sendy-shop-res-card__right">
            {isEditing ? (
              <div className="sendy-shop-res-card__edit-form">
                <div className="sendy-shop-res-card__edit-field">
                  <label
                    className="sendy-shop-res-card__field-label"
                    htmlFor={`${formId}-bike-size`}
                  >
                    Bike size
                  </label>
                  <Select
                    id={`${formId}-bike-size`}
                    className="sendy-shop-res-card__select"
                    value={bikeSize}
                    onChange={(e) => setBikeSize(e.currentTarget.value)}
                  >
                    {BIKE_SIZES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="sendy-shop-res-card__edit-field">
                  <label
                    className="sendy-shop-res-card__field-label"
                    htmlFor={`${formId}-helmet`}
                  >
                    Helmet size
                  </label>
                  <Select
                    id={`${formId}-helmet`}
                    className="sendy-shop-res-card__select"
                    value={helmetSize}
                    onChange={(e) => setHelmetSize(e.currentTarget.value)}
                  >
                    {HELMET_SIZES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="sendy-shop-res-card__edit-field">
                  <label
                    className="sendy-shop-res-card__field-label"
                    htmlFor={`${formId}-pickup`}
                  >
                    Pickup
                  </label>
                  <PocInput
                    id={`${formId}-pickup`}
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.currentTarget.value)}
                  />
                </div>
                <div className="sendy-shop-res-card__edit-field">
                  <label
                    className="sendy-shop-res-card__field-label"
                    htmlFor={`${formId}-return`}
                  >
                    Return
                  </label>
                  <PocInput
                    id={`${formId}-return`}
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.currentTarget.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="sendy-shop-res-card__details-copy">
                <p>{saved.bikeDetailsLine}</p>
                <p>{saved.pickupLine}</p>
                <p>{saved.returnLine}</p>
                <p>{totalChargesLine}</p>
                {declineReasonLine ? <p>{declineReasonLine}</p> : null}
              </div>
            )}
          </div>
        </div>

        {isEditing ? (
          <footer className="sendy-shop-res-card__footer">
            <Button
              variant="secondary"
              size="md"
              type="button"
              onClick={cancelEdit}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="button"
              onClick={saveEdit}
            >
              Save
            </Button>
          </footer>
        ) : showPrimaryFooter ? (
          <footer className="sendy-shop-res-card__footer">
            {onDecline ? (
              <Button
                variant="destructive"
                size="md"
                type="button"
                onClick={openDeclineDialog}
              >
                Decline
              </Button>
            ) : null}
            {onEdit ? (
              <Button
                variant="secondary"
                size="md"
                type="button"
                onClick={openEdit}
              >
                Edit
              </Button>
            ) : null}
            {status === "pending" && onApprove ? (
              <Button
                variant="primary"
                size="md"
                type="button"
                onClick={onApprove}
              >
                Approve
              </Button>
            ) : null}
            {status === "approved" && onPickedUp ? (
              <Button
                variant="primary"
                size="md"
                type="button"
                onClick={handlePickedUp}
              >
                Picked Up
              </Button>
            ) : null}
          </footer>
        ) : null}
      </article>
    </>
  );
}

export default ShopReservationCard;
