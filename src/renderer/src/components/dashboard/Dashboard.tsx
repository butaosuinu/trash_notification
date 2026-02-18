import { getDay } from "date-fns";
import { useSchedule } from "../../hooks/useSchedule";
import { DateTimeDisplay } from "./DateTimeDisplay";
import { TrashInfo } from "./TrashInfo";
import { WeeklySchedule } from "./WeeklySchedule";

type DashboardProps = {
  onOpenSettings: () => void;
};

export function Dashboard({ onOpenSettings }: DashboardProps) {
  const { schedule } = useSchedule();
  const todayIndex = String(getDay(new Date()));
  const todayTrash = schedule[todayIndex];

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">ゴミ通知</h1>
        <button
          type="button"
          onClick={onOpenSettings}
          className="rounded-lg bg-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-300"
        >
          設定
        </button>
      </div>

      <div className="space-y-4">
        <DateTimeDisplay />
        <TrashInfo day={todayTrash} />
        <WeeklySchedule schedule={schedule} />
      </div>
    </div>
  );
}
