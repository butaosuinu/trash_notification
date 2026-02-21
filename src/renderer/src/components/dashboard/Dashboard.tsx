import { Settings } from "lucide-react";
import { ICON_SIZE } from "../../constants/styles";
import { useSchedule } from "../../hooks/useSchedule";
import { getTodayEntries } from "../../utils/scheduleMatch";
import { IconButton } from "../common/IconButton";
import { DateTimeDisplay } from "./DateTimeDisplay";
import { TrashInfo } from "./TrashInfo";
import { WeeklySchedule } from "./WeeklySchedule";

type DashboardProps = {
  onOpenSettings: () => void;
};

export function Dashboard({ onOpenSettings }: DashboardProps) {
  const { schedule } = useSchedule();
  const todayEntries = getTodayEntries(new Date(), schedule.entries);

  return (
    <div className="flex h-screen flex-col p-4 pt-2">
      <div className="titlebar-drag mb-4 flex items-center justify-between pl-16 pt-1">
        <h1 className="font-heading text-2xl font-bold text-frost-text">ゴミ通知</h1>
        <div className="titlebar-no-drag">
          <IconButton
            variant="nav"
            onClick={onOpenSettings}
            icon={<Settings size={ICON_SIZE} />}
            label="設定"
          />
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        <DateTimeDisplay />
        <TrashInfo entries={todayEntries} />
        <WeeklySchedule schedule={schedule} />
      </div>
    </div>
  );
}
