import React from "react";
import "./Button.css";

type ButtonVariant = "primary" | "secondary" | "destructive" | "tertiary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={[
        "sendy-btn",
        `sendy-btn--${variant}`,
        `sendy-btn--${size}`,
        fullWidth ? "sendy-btn--full" : "",
        disabled ? "sendy-btn--disabled" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;