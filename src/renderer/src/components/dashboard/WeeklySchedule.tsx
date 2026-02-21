import { getDay } from "date-fns";
import type { TrashSchedule, ScheduleEntry, SpecificDatesRule } from "../../types/schedule";
import { DAY_NAMES, TRASH_ICONS, RULE_TYPE_LABELS } from "../../constants/schedule";
import { formatDateToISO } from "../../utils/dateUtils";
import { Card } from "../common/Card";

const SUNDAY_INDEX = 0;
const SATURDAY_INDEX = 6;
const UPCOMING_DAYS_LIMIT = 30;

function getEntriesForDayOfWeek(entries: ScheduleEntry[], dayOfWeek: number): ScheduleEntry[] {
  return entries.filter((entry) => {
    if (entry.rule.type === "specificDates") return false;
    return entry.rule.dayOfWeek === dayOfWeek;
  });
}

function getRuleBadge(entry: ScheduleEntry): string | null {
  if (entry.rule.type === "biweekly") return RULE_TYPE_LABELS.biweekly;
  if (entry.rule.type === "nthWeekday") {
    return entry.rule.weekNumbers.map((n) => `第${String(n)}`).join("・");
  }
  return null;
}

type UpcomingDate = { entry: ScheduleEntry; date: string };

function getUpcomingSpecificDates(entries: ScheduleEntry[]): UpcomingDate[] {
  const today = formatDateToISO(new Date());
  return entries
    .filter(
      (entry): entry is ScheduleEntry & { rule: SpecificDatesRule } =>
        entry.rule.type === "specificDates",
    )
    .flatMap((entry) =>
      entry.rule.dates.filter((date) => date >= today).map((date) => ({ entry, date })),
    )
    .toSorted((a, b) => a.date.localeCompare(b.date))
    .slice(0, UPCOMING_DAYS_LIMIT);
}

type DayColumnProps = {
  dayName: string;
  index: number;
  entries: ScheduleEntry[];
  isToday: boolean;
};

function DayColumn({ dayName, index, entries, isToday }: DayColumnProps) {
  const dayColor =
    index === SUNDAY_INDEX ? "text-red-500" : index === SATURDAY_INDEX ? "text-blue-500" : "";
  return (
    <div className={`rounded p-2 ${isToday ? "bg-blue-100 font-bold" : "bg-gray-50"}`}>
      <div className={`mb-1 ${dayColor}`}>{dayName.charAt(0)}</div>
      {entries.length > 0 ? (
        <div className="space-y-1">
          {entries.map((entry) => {
            const badge = getRuleBadge(entry);
            return (
              <div key={entry.id}>
                <div>{(TRASH_ICONS[entry.trash.icon] as string | undefined) ?? ""}</div>
                <div className="leading-tight">{entry.trash.name}</div>
                {badge !== null && <div className="text-[10px] text-gray-400">{badge}</div>}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-300">-</div>
      )}
    </div>
  );
}

export function WeeklySchedule({ schedule }: { schedule: TrashSchedule }) {
  const today = getDay(new Date());
  const upcomingDates = getUpcomingSpecificDates(schedule.entries);

  return (
    <Card
      title="週間スケジュール"
      titleAs="h2"
      titleClassName="mb-3 text-sm font-medium text-gray-500"
    >
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {DAY_NAMES.map((dayName, index) => (
          <DayColumn
            key={dayName}
            dayName={dayName}
            index={index}
            entries={getEntriesForDayOfWeek(schedule.entries, index)}
            isToday={index === today}
          />
        ))}
      </div>
      {upcomingDates.length > 0 && (
        <div className="mt-3 border-t pt-3">
          <h3 className="mb-2 text-xs font-medium text-gray-400">今後の指定日</h3>
          <div className="space-y-1 text-xs">
            {upcomingDates.map(({ entry, date }) => (
              <div key={`${entry.id}-${date}`} className="flex items-center gap-2 text-gray-600">
                <span>{date}</span>
                <span>{entry.trash.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
