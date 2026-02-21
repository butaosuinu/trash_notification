import type { ReactNode, MouseEventHandler } from "react";

type ButtonVariant = "primary" | "secondary" | "success" | "danger-ghost" | "nav";

type ButtonProps = {
  readonly variant?: ButtonVariant;
  readonly onClick: MouseEventHandler<HTMLButtonElement>;
  readonly children: ReactNode;
  readonly disabled?: boolean;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "rounded bg-frost-accent/20 border border-frost-accent/40 px-4 py-2 text-sm text-frost-accent hover:bg-frost-accent/30 hover:text-blue-300 transition-all duration-150",
  secondary:
    "rounded bg-frost-glass border border-frost-glass-border px-4 py-2 text-sm text-frost-text-secondary hover:bg-frost-glass-hover hover:text-frost-text transition-all duration-150",
  success:
    "rounded bg-frost-success px-4 py-2 text-sm text-white hover:bg-emerald-400 transition-all duration-150",
  "danger-ghost":
    "rounded px-2 py-1 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-150",
  nav: "rounded-lg bg-frost-glass border border-frost-glass-border px-3 py-1 text-sm text-frost-text-secondary hover:bg-frost-glass-hover hover:text-frost-text transition-all duration-150",
};

export function Button({ variant = "primary", onClick, children, disabled }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={VARIANT_CLASSES[variant]}
    >
      {children}
    </button>
  );
}
