import { addDays, startOfWeek, isSameDay } from "date-fns";
import type { TrashSchedule, ScheduleEntry, SpecificDatesRule } from "../../types/schedule";
import { SHORT_DAY_NAMES, TRASH_ICONS } from "../../constants/schedule";
import { formatDateToISO, formatColumnDate } from "../../utils/dateUtils";
import { getTodayEntries } from "../../utils/scheduleMatch";
import { Card } from "../common/Card";
import { RuleBadge } from "../common/RuleBadge";

const SUNDAY_INDEX = 0;
const SATURDAY_INDEX = 6;
const DAYS_IN_WEEK = 7;
const UPCOMING_DAYS_LIMIT = 30;

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

function getDayColor(dayIndex: number): string {
  if (dayIndex === SUNDAY_INDEX) return "text-red-400";
  if (dayIndex === SATURDAY_INDEX) return "text-frost-cyan";
  return "text-frost-text-secondary";
}

function getColumnStyle(day: WeekDay): string {
  const base = "rounded px-1.5 py-2.5 transition-colors duration-150";
  if (day.isToday) return `${base} bg-frost-accent/15 font-bold border border-frost-accent/30`;
  if (day.isTomorrow) return `${base} bg-frost-glass border border-frost-glass-border`;
  return `${base} bg-frost-glass`;
}

function DayColumn({ day }: { readonly day: WeekDay }) {
  const dayName = SHORT_DAY_NAMES[day.dayIndex];
  const dateLabel = formatColumnDate(day.date);

  return (
    <div data-testid={`day-column-${day.dayIndex}`} className={getColumnStyle(day)}>
      <div className={`text-[11px] font-medium ${getDayColor(day.dayIndex)}`}>{dayName}</div>
      <div className="mb-2 text-[10px] text-frost-text-muted">{dateLabel}</div>
      {day.entries.length > 0 ? (
        <div className="space-y-3">
          {day.entries.map((entry) => (
            <div key={entry.id} className="space-y-2">
              <div>{(TRASH_ICONS[entry.trash.icon] as string | undefined) ?? ""}</div>
              <div>{entry.trash.name}</div>
              <RuleBadge rule={entry.rule} dayOfWeek={day.dayIndex} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-frost-text-muted">-</div>
      )}
    </div>
  );
}

export function WeeklySchedule({ schedule }: { schedule: TrashSchedule }) {
  const weekDays = buildWeekDays(schedule);
  const upcomingDates = getUpcomingSpecificDates(schedule.entries);

  return (
    <Card
      title="今週のゴミ収集"
      titleAs="h2"
      titleClassName="mb-3 text-sm font-medium text-frost-text-secondary"
    >
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
        {weekDays.map((day) => (
          <DayColumn key={day.dayIndex} day={day} />
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
