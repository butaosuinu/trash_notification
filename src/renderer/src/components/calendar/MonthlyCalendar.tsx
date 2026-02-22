import { useCallback, useState } from "react";
import { addMonths, startOfMonth, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ICON_SIZE } from "../../constants/styles";
import { useDateTime } from "../../hooks/useDateTime";
import { useSchedule } from "../../hooks/useSchedule";
import { formatMonthYear } from "../../utils/dateUtils";
import { Card } from "../common/Card";
import { IconButton } from "../common/IconButton";
import { PageHeader } from "../common/PageHeader";
import { CalendarGrid } from "./CalendarGrid";

type MonthlyCalendarProps = {
  readonly onBack: () => void;
};

type MonthNavigationProps = {
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly onToday: () => void;
};

function MonthNavigation({ onPrev, onNext, onToday }: MonthNavigationProps) {
  return (
    <div className="titlebar-no-drag ml-auto flex items-center gap-1">
      <IconButton
        variant="nav"
        onClick={onPrev}
        icon={<ChevronLeft size={ICON_SIZE} />}
        label="前月"
      />
      <button
        type="button"
        onClick={onToday}
        className="rounded-lg bg-frost-glass px-3 py-1.5 text-xs font-medium text-frost-text-secondary transition-all duration-150 hover:bg-frost-glass-hover hover:text-frost-text"
      >
        今月
      </button>
      <IconButton
        variant="nav"
        onClick={onNext}
        icon={<ChevronRight size={ICON_SIZE} />}
        label="翌月"
      />
    </div>
  );
}

export function MonthlyCalendar({ onBack }: MonthlyCalendarProps) {
  const { schedule } = useSchedule();
  const now = useDateTime();
  const [displayMonth, setDisplayMonth] = useState(() => startOfMonth(now));

  const handlePrevMonth = useCallback(() => {
    setDisplayMonth((prev) => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setDisplayMonth((prev) => addMonths(prev, 1));
  }, []);

  const handleGoToToday = useCallback(() => {
    setDisplayMonth(startOfMonth(new Date()));
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <PageHeader
        title="カレンダー"
        onBack={onBack}
        trailing={
          <MonthNavigation
            onPrev={handlePrevMonth}
            onNext={handleNextMonth}
            onToday={handleGoToToday}
          />
        }
      />

      <div className="flex-1 overflow-y-auto p-4">
        <Card
          title={formatMonthYear(displayMonth)}
          titleAs="h2"
          titleClassName="mb-3 text-sm font-medium text-frost-text-secondary"
        >
          <CalendarGrid displayMonth={displayMonth} entries={schedule.entries} today={now} />
        </Card>
      </div>
    </div>
  );
}
