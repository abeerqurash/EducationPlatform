import type { ButtonHTMLAttributes } from "react";

export type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button type={type} {...props}>
      {children}
    </button>
  );
}