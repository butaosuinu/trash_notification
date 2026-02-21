import { useSchedule } from "../../hooks/useSchedule";
import { getTodayEntries } from "../../utils/scheduleMatch";
import { Button } from "../common/Button";
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
    <div className="flex min-h-screen flex-col bg-gray-100 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">ゴミ通知</h1>
        <Button variant="nav" onClick={onOpenSettings}>
          設定
        </Button>
      </div>

      <div className="space-y-4">
        <DateTimeDisplay />
        <TrashInfo entries={todayEntries} />
        <WeeklySchedule schedule={schedule} />
      </div>
    </div>
  );
}
