import type { ScheduleEntry } from "../../types/schedule";
import { Card } from "../common/Card";
import { TrashIcon } from "../common/TrashIcon";

type TrashInfoProps = {
  entries: ScheduleEntry[];
};

export function TrashInfo({ entries }: TrashInfoProps) {
  return (
    <Card title="今日の収集するゴミ" titleAs="h2">
      {entries.length > 0 ? (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center gap-3">
              <TrashIcon icon={entry.trash.icon} />
              <span className="text-xl font-bold text-frost-text">{entry.trash.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-frost-text-secondary">今日のゴミ回収はありません</p>
      )}
    </Card>
  );
}
