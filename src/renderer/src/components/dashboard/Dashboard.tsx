import { addDays } from "date-fns";
import { Settings } from "lucide-react";
import { ICON_SIZE } from "../../constants/styles";
import { useDateTime } from "../../hooks/useDateTime";
import { useSchedule } from "../../hooks/useSchedule";
import { formatTitlebarDate } from "../../utils/dateUtils";
import { getTodayEntries } from "../../utils/scheduleMatch";
import { IconButton } from "../common/IconButton";
import { TodayTomorrowCard } from "./TodayTomorrowCard";
import { WeeklySchedule } from "./WeeklySchedule";

const TOMORROW_OFFSET = 1;

type DashboardProps = {
  onOpenSettings: () => void;
};

export function Dashboard({ onOpenSettings }: DashboardProps) {
  const { schedule } = useSchedule();
  const now = useDateTime();
  const tomorrow = addDays(now, TOMORROW_OFFSET);
  const todayEntries = getTodayEntries(now, schedule.entries);
  const tomorrowEntries = getTodayEntries(tomorrow, schedule.entries);

  return (
    <div className="flex h-screen flex-col">
      <div className="glass-titlebar titlebar-drag sticky top-0 z-10 flex items-center justify-between pb-3 pl-16 pr-4 pt-3">
        <div className="flex items-baseline gap-2">
          <h1 className="font-heading text-2xl font-bold text-frost-text">ゴミ通知</h1>
          <span className="text-xs text-frost-text-secondary">{formatTitlebarDate(now)}</span>
        </div>
        <div className="titlebar-no-drag">
          <IconButton
            variant="nav"
            onClick={onOpenSettings}
            icon={<Settings size={ICON_SIZE} />}
            label="設定"
          />
        </div>
      </div>

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
