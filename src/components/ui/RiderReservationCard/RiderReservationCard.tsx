import React from "react";
import { Button } from "@/components/ui/Button/Button";
import { Pill } from "@/components/ui/Pill/Pill";
import { formatDisplayDate } from "@/lib/format-display-date";
import "./RiderReservationCard.css";

type RiderReservationState = "draft" | "priced" | "reserved";

type RiderReservationCardProps = {
  bikeTitle: string;
  priceLine: string;
  description: string;
  bikeLine: string;
  sizeLine: string;
  hostedBy: string;
  state?: RiderReservationState;
  startValue: string;
  endValue: string;
  totalChargesLine?: string;
  reservationBikeLine?: string;
  reservationPickupLine?: string;
  reservationReturnLine?: string;
  reservationTotalLine?: string;
  onOpenStartPicker: () => void;
  onOpenEndPicker: () => void;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onReserve: () => void;
  startInputRef?: React.RefObject<HTMLInputElement | null>;
  endInputRef?: React.RefObject<HTMLInputElement | null>;
};

export function RiderReservationCard({
  bikeTitle,
  priceLine,
  description,
  bikeLine,
  sizeLine,
  hostedBy,
  state = "draft",
  startValue,
  endValue,
  totalChargesLine,
  reservationBikeLine,
  reservationPickupLine,
  reservationReturnLine,
  reservationTotalLine,
  onOpenStartPicker,
  onOpenEndPicker,
  onStartChange,
  onEndChange,
  onReserve,
  startInputRef,
  endInputRef,
}: RiderReservationCardProps) {
  const startLabel = startValue ? formatDisplayDate(startValue) : "Start";
  const endLabel = endValue ? formatDisplayDate(endValue) : "End";

  return (
    <article className="sendy-rider-res-card">
      <div className="sendy-rider-res-card__body">
        <div className="sendy-rider-res-card__left">
          <h2 className="sendy-rider-res-card__title">{bikeTitle}</h2>
          <p className="sendy-rider-res-card__price">{priceLine}</p>
          <p className="sendy-rider-res-card__description">{description}</p>
          <p className="sendy-rider-res-card__meta">{bikeLine}</p>
          <p className="sendy-rider-res-card__meta">{sizeLine}</p>
          <p className="sendy-rider-res-card__hosted-by">Hosted by {hostedBy}</p>
        </div>

        <div className="sendy-rider-res-card__right">
          {state === "reserved" ? (
            <>
              <h3 className="sendy-rider-res-card__heading">Reservation Details</h3>
              <Pill variant="success" className="sendy-rider-res-card__status-pill">
                RESERVED
              </Pill>
              <div className="sendy-rider-res-card__details-copy">
                {reservationBikeLine ? <p>{reservationBikeLine}</p> : null}
                {reservationPickupLine ? <p>{reservationPickupLine}</p> : null}
                {reservationReturnLine ? <p>{reservationReturnLine}</p> : null}
                {reservationTotalLine ? <p>{reservationTotalLine}</p> : null}
              </div>
            </>
          ) : (
            <>
              <h3 className="sendy-rider-res-card__heading">Check Availability</h3>
              <form
                className="sendy-rider-res-card__form"
                onSubmit={(event) => {
                  event.preventDefault();
                  onReserve();
                }}
              >
                <div className="sendy-rider-res-card__date-range" aria-label="Rental dates">
                  <div className="sendy-rider-res-card__date-field">
                    <button type="button" className="sendy-rider-res-card__date-button" onClick={onOpenStartPicker}>
                      {startLabel}
                    </button>
                    <input
                      ref={startInputRef}
                      className="sendy-rider-res-card__date-native"
                      name="start"
                      type="date"
                      value={startValue}
                      onChange={(event) => onStartChange(event.currentTarget.value)}
                      aria-label="Start date"
                    />
                  </div>
                  <div className="sendy-rider-res-card__date-field">
                    <button type="button" className="sendy-rider-res-card__date-button" onClick={onOpenEndPicker}>
                      {endLabel}
                    </button>
                    <input
                      ref={endInputRef}
                      className="sendy-rider-res-card__date-native"
                      name="end"
                      type="date"
                      value={endValue}
                      onChange={(event) => onEndChange(event.currentTarget.value)}
                      aria-label="End date"
                    />
                  </div>
                </div>
                {state === "priced" && totalChargesLine ? (
                  <p className="sendy-rider-res-card__total-charges">{totalChargesLine}</p>
                ) : null}
                <Button type="submit" variant="primary" size="md" className="sendy-rider-res-card__reserve-btn">
                  Reserve
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default RiderReservationCard;
