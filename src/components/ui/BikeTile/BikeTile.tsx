import React from "react";
import "./BikeTile.css";

type BikeTileProps = {
  imageUrl: string;
  imageAlt?: string;
  title: string;
  priceLine: string;
  hostedBy?: string;
  typeLabel: string;
};

export function BikeTile({
  imageUrl,
  imageAlt,
  title,
  priceLine,
  hostedBy = "Bike Shop",
  typeLabel,
}: BikeTileProps) {
  return (
    <article className="sendy-bike-tile">
      <div className="sendy-bike-tile__image-wrap">
        <img src={imageUrl} alt={imageAlt ?? title} className="sendy-bike-tile__image" />
      </div>
      <div className="sendy-bike-tile__content">
        <h3 className="sendy-bike-tile__title">{title}</h3>
        <p className="sendy-bike-tile__price">{priceLine}</p>
        <p className="sendy-bike-tile__hosted-by">
          Hosted by <span className="sendy-bike-tile__hosted-by-name">{hostedBy}</span>
        </p>
        <span className="sendy-bike-tile__type-pill">{typeLabel}</span>
      </div>
    </article>
  );
}

export default BikeTile;
