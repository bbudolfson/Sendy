import React from "react";
import "./Pill.css";

type PillVariant = "error" | "success" | "pending";
type PillSize = "sm" | "md" | "lg";

type PillProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: PillVariant;
  size?: PillSize;
  children: React.ReactNode;
};

export function Pill({
  variant = "pending",
  size = "md",
  children,
  className = "",
  ...props
}: PillProps) {
  return (
    <span
      className={["sendy-pill", `sendy-pill--${variant}`, `sendy-pill--${size}`, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}

export default Pill;
