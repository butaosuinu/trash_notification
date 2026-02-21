import { FileUp, Wand2, Save, X } from "lucide-react";
import { ICON_SIZE } from "../../constants/styles";
import { useGeminiImport } from "../../hooks/useGeminiImport";
import { useSchedule } from "../../hooks/useSchedule";
import { IconButton } from "../common/IconButton";
import { Card } from "../common/Card";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { DAY_NAMES, RULE_TYPE_LABELS } from "../../constants/schedule";
import type { TrashSchedule, ScheduleRule } from "../../types/schedule";

function describeRule(rule: ScheduleRule): string {
  switch (rule.type) {
    case "weekly":
      return `${RULE_TYPE_LABELS.weekly} ${DAY_NAMES[rule.dayOfWeek]}`;
    case "biweekly":
      return `${RULE_TYPE_LABELS.biweekly} ${DAY_NAMES[rule.dayOfWeek]}`;
    case "nthWeekday":
      return rule.patterns
        .map((p) => {
          const weeks = p.weekNumbers.map((n) => `第${String(n)}`).join("・");
          return `${weeks} ${DAY_NAMES[p.dayOfWeek]}`;
        })
        .join(" + ");
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
      <h4 className="mb-2 text-sm font-medium text-frost-text">抽出結果のプレビュー</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-frost-glass-border text-left">
            <th className="py-1 pr-2">ゴミの種類</th>
            <th className="py-1">スケジュール</th>
          </tr>
        </thead>
        <tbody>
          {schedule.entries.map((entry) => (
            <tr key={entry.id} className="border-b border-frost-glass-border">
              <td className="py-1 pr-2 font-medium text-frost-text">{entry.trash.name}</td>
              <td className="py-1 text-frost-text-secondary">{describeRule(entry.rule)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex gap-2">
        <IconButton onClick={onConfirm} icon={<Save size={ICON_SIZE} />} label="保存" />
        <IconButton
          variant="secondary"
          onClick={onCancel}
          icon={<X size={ICON_SIZE} />}
          label="キャンセル"
        />
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
    <Card title="PDF からスケジュールを読み込み">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <IconButton
            variant="secondary"
            onClick={() => {
              void selectFile();
            }}
            icon={<FileUp size={ICON_SIZE} />}
            label="PDF を選択"
          />
          {filePath !== null && (
            <span className="truncate text-sm text-frost-text-secondary">{filePath}</span>
          )}
        </div>
        {filePath !== null && extractedSchedule === null && !isLoading && (
          <IconButton
            variant="success"
            onClick={() => {
              void extractSchedule();
            }}
            icon={<Wand2 size={ICON_SIZE} />}
            label="解析"
          />
        )}
        {isLoading && <LoadingSpinner />}
        {error !== null && <p className="text-sm text-frost-danger">{error}</p>}
        {extractedSchedule !== null && (
          <SchedulePreview
            schedule={extractedSchedule}
            onConfirm={handleConfirm}
            onCancel={reset}
          />
        )}
      </div>
    </Card>
  );
}
