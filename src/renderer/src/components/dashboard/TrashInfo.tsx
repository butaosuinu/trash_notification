import type { TrashDay } from "../../types/schedule";
import { TrashIcon } from "../common/TrashIcon";

type TrashInfoProps = {
  day: TrashDay | undefined;
};

export function TrashInfo({ day }: TrashInfoProps) {
  const hasCollection = day !== undefined && day.name !== "";

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h2 className="mb-2 text-sm font-medium text-gray-500">今日の収集するゴミ</h2>
      {hasCollection ? (
        <div className="flex items-center gap-3">
          <TrashIcon icon={day.icon} />
          <span className="text-xl font-bold text-gray-800">{day.name}</span>
        </div>
      ) : (
        <p className="text-gray-500">今日のゴミ回収はありません</p>
      )}
    </div>
  );
}
