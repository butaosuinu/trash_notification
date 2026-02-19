import type { ScheduleEntry } from "../../types/schedule";
import { TrashIcon } from "../common/TrashIcon";

type TrashInfoProps = {
  entries: ScheduleEntry[];
};

export function TrashInfo({ entries }: TrashInfoProps) {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h2 className="mb-2 text-sm font-medium text-gray-500">今日の収集するゴミ</h2>
      {entries.length > 0 ? (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center gap-3">
              <TrashIcon icon={entry.trash.icon} />
              <span className="text-xl font-bold text-gray-800">{entry.trash.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">今日のゴミ回収はありません</p>
      )}
    </div>
  );
}
