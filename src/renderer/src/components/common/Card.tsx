import type { ReactNode } from "react";

type CardProps = {
  readonly title?: string;
  readonly titleAs?: "h2" | "h3";
  readonly titleClassName?: string;
  readonly className?: string;
  readonly children: ReactNode;
};

const DEFAULT_TITLE_CLASS = "mb-2 text-sm font-medium text-frost-text-secondary";

export function Card({
  title,
  titleAs: TitleTag = "h3",
  titleClassName = DEFAULT_TITLE_CLASS,
  className,
  children,
}: CardProps) {
  return (
    <div className={`glass rounded-lg p-4 animate-fade-in ${className ?? ""}`}>
      {title !== undefined && <TitleTag className={titleClassName}>{title}</TitleTag>}
      {children}
    </div>
  );
}
