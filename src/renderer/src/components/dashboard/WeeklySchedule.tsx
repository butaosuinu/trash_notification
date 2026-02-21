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
    if (entry.rule.type === "nthWeekday") {
      return entry.rule.patterns.some((p) => p.dayOfWeek === dayOfWeek);
    }
    return entry.rule.dayOfWeek === dayOfWeek;
  });
}

function getRuleBadge(entry: ScheduleEntry, dayOfWeek: number): string | null {
  if (entry.rule.type === "biweekly") return RULE_TYPE_LABELS.biweekly;
  if (entry.rule.type === "nthWeekday") {
    const weekNumbers = entry.rule.patterns
      .filter((p) => p.dayOfWeek === dayOfWeek)
      .flatMap((p) => p.weekNumbers)
      .toSorted((a, b) => a - b);
    if (weekNumbers.length === 0) return null;
    return weekNumbers.map((n) => `第${String(n)}`).join("・");
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
    index === SUNDAY_INDEX
      ? "text-red-400"
      : index === SATURDAY_INDEX
        ? "text-frost-cyan"
        : "text-frost-text-secondary";
  return (
    <div
      className={`rounded p-2 transition-colors duration-150 ${isToday ? "bg-frost-accent/15 font-bold border border-frost-accent/30" : "bg-frost-glass"}`}
    >
      <div className={`mb-1 ${dayColor}`}>{dayName.charAt(0)}</div>
      {entries.length > 0 ? (
        <div className="space-y-1">
          {entries.map((entry) => {
            const badge = getRuleBadge(entry, index);
            return (
              <div key={entry.id}>
                <div>{(TRASH_ICONS[entry.trash.icon] as string | undefined) ?? ""}</div>
                <div className="leading-tight">{entry.trash.name}</div>
                {badge !== null && <div className="text-[10px] text-frost-text-muted">{badge}</div>}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-frost-text-muted">-</div>
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
      titleClassName="mb-3 text-sm font-medium text-frost-text-secondary"
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
        <div className="mt-3 border-t border-frost-glass-border pt-3">
          <h3 className="mb-2 text-xs font-medium text-frost-text-muted">今後の指定日</h3>
          <div className="space-y-1 text-xs">
            {upcomingDates.map(({ entry, date }) => (
              <div
                key={`${entry.id}-${date}`}
                className="flex items-center gap-2 text-frost-text-secondary"
              >
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
