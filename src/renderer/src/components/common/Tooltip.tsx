import { useCallback, useRef, useState, type CSSProperties, type ReactNode } from "react";

type TooltipProps = {
  readonly label: string;
  readonly children: ReactNode;
  readonly position?: "top" | "bottom";
};

type Placement = {
  readonly vertical: "top" | "bottom";
  readonly offsetX: number;
};

const TOOLTIP_RESERVE = 40;
const VIEWPORT_PADDING = 8;
const HALF_DIVISOR = 2;

const VERTICAL_CLASSES: Record<"top" | "bottom", string> = {
  top: "bottom-full mb-2",
  bottom: "top-full mt-2",
};

const ARROW_VERTICAL_CLASS: Record<"top" | "bottom", string> = {
  top: "absolute top-full",
  bottom: "absolute bottom-full",
};

const FROST_BASE_90 = "rgba(11, 17, 32, 0.9)";

const ARROW_BORDER: Record<"top" | "bottom", CSSProperties> = {
  top: {
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    borderTop: `5px solid ${FROST_BASE_90}`,
  },
  bottom: {
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    borderBottom: `5px solid ${FROST_BASE_90}`,
  },
};

const DEFAULT_PLACEMENT: Placement = { vertical: "top", offsetX: 0 };

function calculatePlacement(
  wrapper: HTMLSpanElement,
  tooltip: HTMLSpanElement,
  preferred: "top" | "bottom",
): Placement {
  const rect = wrapper.getBoundingClientRect();
  const spaceAbove = rect.top;
  const spaceBelow = window.innerHeight - rect.bottom;
  const vertical =
    preferred === "top" && spaceAbove < TOOLTIP_RESERVE
      ? "bottom"
      : preferred === "bottom" && spaceBelow < TOOLTIP_RESERVE
        ? "top"
        : preferred;

  const tooltipWidth = tooltip.scrollWidth;
  const centerX = rect.left + rect.width / HALF_DIVISOR;
  const halfWidth = tooltipWidth / HALF_DIVISOR;
  const leftEdge = centerX - halfWidth;
  const rightEdge = centerX + halfWidth;
  const offsetX =
    leftEdge < VIEWPORT_PADDING
      ? VIEWPORT_PADDING - leftEdge
      : rightEdge > window.innerWidth - VIEWPORT_PADDING
        ? window.innerWidth - VIEWPORT_PADDING - rightEdge
        : 0;

  return { vertical, offsetX };
}

export function Tooltip({ label, children, position = "top" }: TooltipProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [placement, setPlacement] = useState<Placement>(DEFAULT_PLACEMENT);

  const updatePlacement = useCallback(() => {
    const wrapper = wrapperRef.current;
    const tooltip = tooltipRef.current;
    if (wrapper && tooltip) {
      setPlacement(calculatePlacement(wrapper, tooltip, position));
    }
  }, [position]);

  const v = placement.vertical;

  return (
    <span
      ref={wrapperRef}
      className="group/tooltip relative inline-flex"
      onMouseEnter={updatePlacement}
    >
      {children}
      <span
        ref={tooltipRef}
        role="tooltip"
        className={`pointer-events-none absolute ${VERTICAL_CLASSES[v]} z-50 whitespace-nowrap rounded border border-frost-glass-border bg-frost-base/90 px-2 py-1 text-xs text-frost-text-secondary opacity-0 backdrop-blur-md transition-opacity delay-300 duration-150 group-hover/tooltip:opacity-100`}
        style={{ left: "50%", translate: `calc(-50% + ${String(placement.offsetX)}px) 0` }}
      >
        {label}
        <span
          className={ARROW_VERTICAL_CLASS[v]}
          style={{
            ...ARROW_BORDER[v],
            left: `calc(50% - ${String(placement.offsetX)}px)`,
            translate: "-50% 0",
          }}
        />
      </span>
    </span>
  );
}
