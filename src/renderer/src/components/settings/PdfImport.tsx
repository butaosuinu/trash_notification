import { useGeminiImport } from "../../hooks/useGeminiImport";
import { useSchedule } from "../../hooks/useSchedule";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { DAY_NAMES, RULE_TYPE_LABELS } from "../../constants/schedule";
import type { TrashSchedule, ScheduleRule } from "../../types/schedule";

function describeRule(rule: ScheduleRule): string {
  switch (rule.type) {
    case "weekly":
      return `${RULE_TYPE_LABELS.weekly} ${DAY_NAMES[rule.dayOfWeek]}`;
    case "biweekly":
      return `${RULE_TYPE_LABELS.biweekly} ${DAY_NAMES[rule.dayOfWeek]}`;
    case "nthWeekday": {
      const weeks = rule.weekNumbers.map((n) => `第${String(n)}`).join("・");
      return `${weeks} ${DAY_NAMES[rule.dayOfWeek]}`;
    }
    case "specificDates":
      return `${RULE_TYPE_LABELS.specificDates} (${String(rule.dates.length)}日)`;
  }
}

type PreviewProps = {
  schedule: TrashSchedule;
  onConfirm: () => void;
  onCancel: () => void;
};

function SchedulePreview({ schedule, onConfirm, onCancel }: PreviewProps) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-medium text-gray-700">抽出結果のプレビュー</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-1 pr-2">ゴミの種類</th>
            <th className="py-1">スケジュール</th>
          </tr>
        </thead>
        <tbody>
          {schedule.entries.map((entry) => (
            <tr key={entry.id} className="border-b">
              <td className="py-1 pr-2 font-medium">{entry.trash.name}</td>
              <td className="py-1 text-gray-600">{describeRule(entry.rule)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onConfirm}
          className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
        >
          保存
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}

export function PdfImport() {
  const { filePath, extractedSchedule, isLoading, error, selectFile, extractSchedule, reset } =
    useGeminiImport();
  const { saveSchedule } = useSchedule();

  const handleConfirm = () => {
    if (extractedSchedule === null) return;
    void saveSchedule(extractedSchedule).then(reset);
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h3 className="mb-2 text-sm font-medium text-gray-500">PDF からスケジュールを読み込み</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              void selectFile();
            }}
            className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
          >
            PDF を選択
          </button>
          {filePath !== null && <span className="truncate text-sm text-gray-600">{filePath}</span>}
        </div>
        {filePath !== null && extractedSchedule === null && !isLoading && (
          <button
            type="button"
            onClick={() => {
              void extractSchedule();
            }}
            className="rounded bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600"
          >
            解析
          </button>
        )}
        {isLoading && <LoadingSpinner />}
        {error !== null && <p className="text-sm text-red-500">{error}</p>}
        {extractedSchedule !== null && (
          <SchedulePreview
            schedule={extractedSchedule}
            onConfirm={handleConfirm}
            onCancel={reset}
          />
        )}
      </div>
    </div>
  );
}
