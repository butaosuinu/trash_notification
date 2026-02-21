import { getDay } from "date-fns";
import type { ScheduleEntry } from "../../types/schedule";
import { formatShortDate } from "../../utils/dateUtils";
import { Card } from "../common/Card";
import { TrashIcon } from "../common/TrashIcon";
import { RuleBadge } from "../common/RuleBadge";

type TodayTomorrowCardProps = {
  readonly todayEntries: ScheduleEntry[];
  readonly tomorrowEntries: ScheduleEntry[];
  readonly tomorrow: Date;
};

function TodayColumn({ entries }: { readonly entries: ScheduleEntry[] }) {
  return (
    <div className="pr-4">
      <h3 className="mb-2 text-xs font-medium text-frost-accent">今日</h3>
      {entries.length > 0 ? (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center gap-2">
              <TrashIcon icon={entry.trash.icon} />
              <span className="text-lg font-bold text-frost-text">{entry.trash.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-frost-text-secondary">回収はありません</p>
      )}
    </div>
  );
}

function TomorrowColumn({
  entries,
  tomorrow,
}: {
  readonly entries: ScheduleEntry[];
  readonly tomorrow: Date;
}) {
  const dateLabel = formatShortDate(tomorrow);
  const tomorrowDayOfWeek = getDay(tomorrow);

  return (
    <div className="border-l border-frost-glass-border pl-4">
      <div className="mb-2 flex items-baseline gap-1.5">
        <h3 className="text-xs font-medium text-frost-text-secondary">明日</h3>
        <span className="text-[10px] text-frost-text-muted">{dateLabel}</span>
      </div>
      {entries.length > 0 ? (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center gap-2">
              <TrashIcon icon={entry.trash.icon} />
              <span className="text-base font-bold text-frost-text">{entry.trash.name}</span>
              <RuleBadge rule={entry.rule} dayOfWeek={tomorrowDayOfWeek} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-frost-text-secondary">回収はありません</p>
      )}
    </div>
  );
}

export function TodayTomorrowCard({
  todayEntries,
  tomorrowEntries,
  tomorrow,
}: TodayTomorrowCardProps) {
  return (
    <Card>
      <div className="grid grid-cols-2">
        <TodayColumn entries={todayEntries} />
        <TomorrowColumn entries={tomorrowEntries} tomorrow={tomorrow} />
      </div>
    </Card>
  );
}
