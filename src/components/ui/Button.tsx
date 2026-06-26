import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors disabled:opacity-50 cursor-pointer";

  const variantCls = {
    primary: "bg-primary text-on-primary hover:opacity-80",
    secondary:
      "bg-surface-card text-body hover:bg-surface-strong border border-hairline",
    ghost: "text-muted hover:bg-surface-card",
  }[variant];

  const sizeCls = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-md py-2",
  }[size];

  return (
    <button
      className={`${base} ${variantCls} ${sizeCls} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
