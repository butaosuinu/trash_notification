import {
  addDays,
  getDate,
  getDay,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { ScheduleEntry } from "../../types/schedule";
import { SHORT_DAY_NAMES, TRASH_ICONS } from "../../constants/schedule";
import { formatDateToISO } from "../../utils/dateUtils";
import { getTodayEntries } from "../../utils/scheduleMatch";
import { Tooltip } from "../common/Tooltip";

const DAYS_IN_GRID = 42;
const SUNDAY_INDEX = 0;
const SATURDAY_INDEX = 6;

type CalendarDay = {
  readonly date: Date;
  readonly dateKey: string;
  readonly dayOfMonth: number;
  readonly dayOfWeek: number;
  readonly isCurrentMonth: boolean;
  readonly isToday: boolean;
  readonly entries: ScheduleEntry[];
};

type CalendarGridProps = {
  readonly displayMonth: Date;
  readonly entries: ScheduleEntry[];
  readonly today: Date;
};

function buildCalendarDays(
  displayMonth: Date,
  entries: ScheduleEntry[],
  today: Date,
): CalendarDay[] {
  const monthStart = startOfMonth(displayMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });

  return Array.from({ length: DAYS_IN_GRID }, (_, i) => {
    const date = addDays(gridStart, i);
    return {
      date,
      dateKey: formatDateToISO(date),
      dayOfMonth: getDate(date),
      dayOfWeek: getDay(date),
      isCurrentMonth: isSameMonth(date, displayMonth),
      isToday: isSameDay(date, today),
      entries: getTodayEntries(date, entries),
    };
  });
}

function getDayHeaderColor(dayIndex: number): string {
  if (dayIndex === SUNDAY_INDEX) return "text-red-400";
  if (dayIndex === SATURDAY_INDEX) return "text-frost-cyan";
  return "text-frost-text-muted";
}

function getDayNumberStyle(day: CalendarDay): string {
  const base = "text-[11px] font-medium leading-none";
  if (day.isToday) return `${base} text-frost-accent font-bold`;
  if (day.dayOfWeek === SUNDAY_INDEX) return `${base} text-red-400`;
  if (day.dayOfWeek === SATURDAY_INDEX) return `${base} text-frost-cyan`;
  return `${base} text-frost-text-secondary`;
}

function getCellStyle(day: CalendarDay): string {
  const base = "rounded px-1 py-1 min-h-[56px] transition-colors duration-150";
  if (!day.isCurrentMonth) return `${base} opacity-25`;
  if (day.isToday) return `${base} bg-frost-accent/15 border border-frost-accent/30`;
  if (day.entries.length > 0) return `${base} bg-frost-glass border border-frost-glass-border`;
  return base;
}

function CalendarCell({ day }: { readonly day: CalendarDay }) {
  return (
    <div className={getCellStyle(day)}>
      <div className={getDayNumberStyle(day)}>{day.dayOfMonth}</div>
      {day.entries.length > 0 && (
        <div className="mt-0.5 flex flex-wrap gap-px">
          {day.entries.map((entry) => (
            <Tooltip key={entry.id} label={entry.trash.name} position="bottom">
              <span className="cursor-default text-xs leading-tight">
                {(TRASH_ICONS[entry.trash.icon] as string | undefined) ?? ""}
              </span>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
}

export function CalendarGrid({ displayMonth, entries, today }: CalendarGridProps) {
  const calendarDays = buildCalendarDays(displayMonth, entries, today);

  return (
    <div>
      <div className="mb-1 grid grid-cols-7 gap-1">
        {SHORT_DAY_NAMES.map((name, i) => (
          <div key={name} className={`text-center text-[10px] font-medium ${getDayHeaderColor(i)}`}>
            {name}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => (
          <CalendarCell key={day.dateKey} day={day} />
        ))}
      </div>
    </div>
  );
}
