import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { ICON_SIZE } from "../../constants/styles";
import { IconButton } from "./IconButton";

type PageHeaderProps = {
  readonly title: string;
  readonly onBack?: (() => void) | undefined;
  readonly subtitle?: ReactNode;
  readonly trailing?: ReactNode;
};

export function PageHeader({ title, onBack, subtitle, trailing }: PageHeaderProps) {
  const hasBack = onBack !== undefined;

  return (
    <header
      className={`glass-titlebar titlebar-drag sticky top-0 z-10 flex items-center pb-3 pr-4 pt-3 ${
        hasBack ? "gap-3 pl-20" : "justify-between pl-16"
      }`}
    >
      {hasBack ? (
        <div className="titlebar-no-drag">
          <IconButton
            variant="nav"
            onClick={onBack}
            icon={<ArrowLeft size={ICON_SIZE} />}
            label="戻る"
          />
        </div>
      ) : null}
      {subtitle === undefined ? (
        <h1 className="font-heading text-2xl font-bold text-frost-text">{title}</h1>
      ) : (
        <div className="flex items-baseline gap-2">
          <h1 className="font-heading text-2xl font-bold text-frost-text">{title}</h1>
          {subtitle}
        </div>
      )}
      {trailing}
    </header>
  );
}
