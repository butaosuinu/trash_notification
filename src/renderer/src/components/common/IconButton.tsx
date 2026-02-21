import type { ReactNode, MouseEventHandler } from "react";
import { Tooltip } from "./Tooltip";

type IconButtonVariant = "primary" | "secondary" | "success" | "danger-ghost" | "nav";

type IconButtonProps = {
  readonly variant?: IconButtonVariant;
  readonly onClick: MouseEventHandler<HTMLButtonElement>;
  readonly icon: ReactNode;
  readonly label: string;
  readonly disabled?: boolean;
  readonly tooltipPosition?: "top" | "bottom";
};

const ICON_VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  primary:
    "rounded bg-frost-accent/20 p-2 text-frost-accent transition-all duration-150 hover:bg-frost-accent/30 hover:text-blue-300 disabled:opacity-50",
  secondary:
    "rounded bg-frost-glass p-2 text-frost-text-secondary transition-all duration-150 hover:bg-frost-glass-hover hover:text-frost-text disabled:opacity-50",
  success:
    "rounded bg-frost-success p-2 text-white transition-all duration-150 hover:bg-emerald-400 disabled:opacity-50",
  "danger-ghost":
    "rounded p-1.5 text-red-400 transition-all duration-150 hover:bg-red-500/10 hover:text-red-300",
  nav: "rounded-lg bg-frost-glass p-2 text-frost-text-secondary transition-all duration-150 hover:bg-frost-glass-hover hover:text-frost-text",
};

export function IconButton({
  variant = "primary",
  onClick,
  icon,
  label,
  disabled,
  tooltipPosition = "top",
}: IconButtonProps) {
  return (
    <Tooltip label={label} position={tooltipPosition}>
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        disabled={disabled}
        className={ICON_VARIANT_CLASSES[variant]}
      >
        {icon}
      </button>
    </Tooltip>
  );
}
