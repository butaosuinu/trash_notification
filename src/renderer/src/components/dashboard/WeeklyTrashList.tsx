import { addDays, startOfWeek, isSameDay } from "date-fns";
import type { TrashSchedule, ScheduleEntry } from "../../types/schedule";
import { TRASH_ICONS } from "../../constants/schedule";
import { formatWeekListDate } from "../../utils/dateUtils";
import { getTodayEntries } from "../../utils/scheduleMatch";
import { Card } from "../common/Card";
import { RuleBadge } from "../common/RuleBadge";

const DAYS_IN_WEEK = 7;
const SUNDAY_INDEX = 0;
const SATURDAY_INDEX = 6;
const STAGGER_MS = 50;

type WeekDay = {
  readonly date: Date;
  readonly dayIndex: number;
  readonly entries: ScheduleEntry[];
  readonly isToday: boolean;
  readonly isTomorrow: boolean;
};

function buildWeekDays(schedule: TrashSchedule): WeekDay[] {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const weekStart = startOfWeek(today, { weekStartsOn: 0 });

  return Array.from({ length: DAYS_IN_WEEK }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      date,
      dayIndex: i,
      entries: getTodayEntries(date, schedule.entries),
      isToday: isSameDay(date, today),
      isTomorrow: isSameDay(date, tomorrow),
    };
  });
}

function getDayColor(dayIndex: number): string {
  if (dayIndex === SUNDAY_INDEX) return "text-red-400";
  if (dayIndex === SATURDAY_INDEX) return "text-frost-cyan";
  return "text-frost-text-secondary";
}

function getRowStyle(day: WeekDay, isLast: boolean): string {
  if (day.isToday) return "bg-frost-accent/10 border border-frost-accent/25 rounded-lg p-2.5";
  if (day.isTomorrow) return "bg-frost-glass border border-frost-glass-border rounded-lg p-2.5";
  return `p-2.5 ${isLast ? "" : "border-b border-frost-glass-border"}`;
}

function getDotStyle(day: WeekDay): string {
  const base = "mt-1.5 h-2 w-2 shrink-0 rounded-full";
  if (day.isToday) return `${base} bg-frost-accent shadow-[0_0_6px_rgba(59,130,246,0.4)]`;
  if (day.isTomorrow) return `${base} bg-frost-accent/50`;
  return `${base} bg-frost-text-muted/50`;
}

type WeekDayRowProps = {
  readonly day: WeekDay;
  readonly index: number;
  readonly isLast: boolean;
};

function WeekDayRow({ day, index, isLast }: WeekDayRowProps) {
  const dateLabel = formatWeekListDate(day.date);

  return (
    <div
      className={`animate-fade-in-stagger flex gap-3 ${getRowStyle(day, isLast)}`}
      style={{ animationDelay: `${index * STAGGER_MS}ms` }}
    >
      <div className={getDotStyle(day)} />
      <div className="min-w-0 flex-1">
        <div className={`text-xs font-medium ${getDayColor(day.dayIndex)}`}>
          {dateLabel}
          {day.isToday && (
            <span className="ml-1.5 text-[10px] font-bold text-frost-accent">TODAY</span>
          )}
        </div>
        {day.entries.length > 0 ? (
          <div className="mt-1 space-y-0.5">
            {day.entries.map((entry) => (
              <div key={entry.id} className="flex items-center gap-2">
                <span className="text-sm">
                  {(TRASH_ICONS[entry.trash.icon] as string | undefined) ?? ""}
                </span>
                <span className="text-sm text-frost-text">{entry.trash.name}</span>
                <RuleBadge rule={entry.rule} />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-0.5 text-xs text-frost-text-muted">収集なし</p>
        )}
      </div>
    </div>
  );
}

export function WeeklyTrashList({ schedule }: { schedule: TrashSchedule }) {
  const weekDays = buildWeekDays(schedule);
  const lastIndex = DAYS_IN_WEEK - 1;

  return (
    <Card
      title="今週のゴミ収集"
      titleAs="h2"
      titleClassName="mb-3 text-sm font-medium text-frost-text-secondary"
    >
      <div className="space-y-0">
        {weekDays.map((day, index) => (
          <WeekDayRow key={day.dayIndex} day={day} index={index} isLast={index === lastIndex} />
        ))}
      </div>
    </Card>
  );
}
