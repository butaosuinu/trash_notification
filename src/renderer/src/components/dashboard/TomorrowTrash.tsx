import { getDay } from "date-fns";
import type { ScheduleEntry } from "../../types/schedule";
import { formatShortDate } from "../../utils/dateUtils";
import { Card } from "../common/Card";
import { TrashIcon } from "../common/TrashIcon";
import { RuleBadge } from "../common/RuleBadge";

type TomorrowTrashProps = {
  readonly entries: ScheduleEntry[];
  readonly tomorrow: Date;
};

export function TomorrowTrash({ entries, tomorrow }: TomorrowTrashProps) {
  const dateLabel = formatShortDate(tomorrow);
  const tomorrowDayOfWeek = getDay(tomorrow);

  return (
    <Card title="明日の収集するゴミ" titleAs="h2" className="border-l-2 border-l-frost-accent/40">
      <p className="mb-2 text-xs text-frost-text-muted">{dateLabel}</p>
      {entries.length > 0 ? (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center gap-3">
              <TrashIcon icon={entry.trash.icon} />
              <span className="text-lg font-bold text-frost-text">{entry.trash.name}</span>
              <RuleBadge rule={entry.rule} dayOfWeek={tomorrowDayOfWeek} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-frost-text-secondary">明日のゴミ回収はありません</p>
      )}
    </Card>
  );
}
