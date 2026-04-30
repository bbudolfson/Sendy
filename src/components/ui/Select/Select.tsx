import React, { forwardRef } from "react";
import "./Select.css";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className = "", children, ...props },
  ref,
) {
  return (
    <span className="sendy-select-wrap">
      <select ref={ref} className={["sendy-select", className].filter(Boolean).join(" ")} {...props}>
        {children}
      </select>
      <svg className="sendy-select-icon" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
});

export default Select;
