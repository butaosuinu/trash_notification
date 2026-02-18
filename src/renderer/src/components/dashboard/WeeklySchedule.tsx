import { getDay } from "date-fns";
import type { TrashSchedule } from "../../types/schedule";
import { DAY_NAMES, TRASH_ICONS } from "../../constants/schedule";

type WeeklyScheduleProps = {
  schedule: TrashSchedule;
};

const SUNDAY_INDEX = 0;
const SATURDAY_INDEX = 6;

export function WeeklySchedule({ schedule }: WeeklyScheduleProps) {
  const today = getDay(new Date());

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h2 className="mb-3 text-sm font-medium text-gray-500">週間スケジュール</h2>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {DAY_NAMES.map((dayName, index) => {
          const day = schedule[String(index)];
          const isToday = index === today;

          return (
            <div
              key={dayName}
              className={`rounded p-2 ${isToday ? "bg-blue-100 font-bold" : "bg-gray-50"}`}
            >
              <div
                className={`mb-1 ${index === SUNDAY_INDEX ? "text-red-500" : ""} ${index === SATURDAY_INDEX ? "text-blue-500" : ""}`}
              >
                {dayName.charAt(0)}
              </div>
              {day !== undefined && day.name !== "" ? (
                <>
                  <div>{(TRASH_ICONS[day.icon] as string | undefined) ?? ""}</div>
                  <div className="mt-1 leading-tight">{day.name}</div>
                </>
              ) : (
                <div className="text-gray-300">-</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
