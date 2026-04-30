import React from "react";
import { Button } from "@/components/ui/Button/Button";
import { Pill } from "@/components/ui/Pill/Pill";
import "./ShopReservationCard.css";

type ReservationStatus = "pending" | "approved" | "declined";

export type ShopReservationCardProps = {
  bikeTitle: string;
  priceLine: string;
  status: ReservationStatus;
  requestedBy: string;
  email: string;
  phone: string;
  detailsTitle?: string;
  bikeDetailsLine: string;
  pickupLine: string;
  returnLine: string;
  totalChargesLine: string;
  declineReasonLine?: string;
  onEdit?: () => void;
  onApprove?: () => void;
  onDecline?: () => void;
};

function toPillVariant(status: ReservationStatus): "error" | "success" | "pending" {
  if (status === "approved") return "success";
  if (status === "declined") return "error";
  return "pending";
}

function toPillLabel(status: ReservationStatus): string {
  if (status === "approved") return "APPROVED";
  if (status === "declined") return "DECLINED";
  return "PENDING";
}

export function ShopReservationCard({
  bikeTitle,
  priceLine,
  status,
  requestedBy,
  email,
  phone,
  detailsTitle,
  bikeDetailsLine,
  pickupLine,
  returnLine,
  totalChargesLine,
  declineReasonLine,
  onEdit,
  onApprove,
  onDecline,
}: ShopReservationCardProps) {
  const heading = detailsTitle ?? (status === "declined" ? "Request Declined" : "Request Details");

  return (
    <article className="sendy-shop-res-card">
      <div className="sendy-shop-res-card__body">
        <div className="sendy-shop-res-card__left">
          <h3 className="sendy-shop-res-card__title">{bikeTitle}</h3>
          <p className="sendy-shop-res-card__price">{priceLine}</p>
          <Pill variant={toPillVariant(status)} size="sm" className="sendy-shop-res-card__status-pill">
            {toPillLabel(status)}
          </Pill>
          <p className="sendy-shop-res-card__meta">
            Requested by: <span>{requestedBy}</span>
          </p>
          <p className="sendy-shop-res-card__meta">Email: {email}</p>
          <p className="sendy-shop-res-card__meta">Phone: {phone}</p>
        </div>

        <div className="sendy-shop-res-card__right">
          <div className="sendy-shop-res-card__right-head">
            <h4 className="sendy-shop-res-card__details-title">{heading}</h4>
            {onEdit ? (
              <button type="button" className="sendy-shop-res-card__edit" onClick={onEdit}>
                Edit
              </button>
            ) : null}
          </div>
          <div className="sendy-shop-res-card__details-copy">
            <p>{bikeDetailsLine}</p>
            <p>{pickupLine}</p>
            <p>{returnLine}</p>
            <p>{totalChargesLine}</p>
            {declineReasonLine ? <p>{declineReasonLine}</p> : null}
          </div>

          {status === "pending" ? (
            <div className="sendy-shop-res-card__actions">
              <Button variant="secondary" size="md" onClick={onDecline}>
                Decline
              </Button>
              <Button variant="primary" size="md" onClick={onApprove}>
                Approve
              </Button>
            </div>
          ) : null}

          {status === "approved" ? (
            <div className="sendy-shop-res-card__actions sendy-shop-res-card__actions--single">
              <Button variant="secondary" size="md" onClick={onDecline}>
                Decline
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default ShopReservationCard;
