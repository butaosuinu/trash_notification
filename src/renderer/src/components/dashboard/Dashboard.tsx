import { addDays } from "date-fns";
import { CalendarDays, Settings } from "lucide-react";
import { ICON_SIZE } from "../../constants/styles";
import { useDateTime } from "../../hooks/useDateTime";
import { PageHeader } from "../common/PageHeader";
import { useSchedule } from "../../hooks/useSchedule";
import { formatTitlebarDate } from "../../utils/dateUtils";
import { getTodayEntries } from "../../utils/scheduleMatch";
import { IconButton } from "../common/IconButton";
import { TodayTomorrowCard } from "./TodayTomorrowCard";
import { WeeklySchedule } from "./WeeklySchedule";

const TOMORROW_OFFSET = 1;

type DashboardProps = {
  onOpenCalendar: () => void;
  onOpenSettings: () => void;
};

export function Dashboard({ onOpenCalendar, onOpenSettings }: DashboardProps) {
  const { schedule } = useSchedule();
  const now = useDateTime();
  const tomorrow = addDays(now, TOMORROW_OFFSET);
  const todayEntries = getTodayEntries(now, schedule.entries);
  const tomorrowEntries = getTodayEntries(tomorrow, schedule.entries);

  return (
    <div className="flex h-screen flex-col">
      <PageHeader
        title="ゴミ通知"
        subtitle={
          <span className="text-xs text-frost-text-secondary">{formatTitlebarDate(now)}</span>
        }
        trailing={
          <div className="titlebar-no-drag flex items-center gap-2">
            <IconButton
              variant="nav"
              onClick={onOpenCalendar}
              icon={<CalendarDays size={ICON_SIZE} />}
              label="カレンダー"
            />
            <IconButton
              variant="nav"
              onClick={onOpenSettings}
              icon={<Settings size={ICON_SIZE} />}
              label="設定"
            />
          </div>
        }
      />

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <TodayTomorrowCard
          todayEntries={todayEntries}
          tomorrowEntries={tomorrowEntries}
          tomorrow={tomorrow}
        />
        <WeeklySchedule schedule={schedule} />
      </div>
    </div>
  );
}
