import type { ReactNode, MouseEventHandler } from "react";

type ButtonVariant = "primary" | "secondary" | "success" | "danger-ghost" | "nav";

type ButtonProps = {
  readonly variant?: ButtonVariant;
  readonly onClick: MouseEventHandler<HTMLButtonElement>;
  readonly children: ReactNode;
  readonly disabled?: boolean;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600",
  secondary: "rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300",
  success: "rounded bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600",
  "danger-ghost": "rounded px-2 py-1 text-sm text-red-400 hover:bg-red-50 hover:text-red-600",
  nav: "rounded-lg bg-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-300",
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
