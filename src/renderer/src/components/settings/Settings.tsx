import { ApiKeyInput } from "./ApiKeyInput";
import { PdfImport } from "./PdfImport";
import { ScheduleEditor } from "./ScheduleEditor";
import { NotificationSettings } from "./NotificationSettings";

type SettingsProps = {
  onBack: () => void;
};

export function Settings({ onBack }: SettingsProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 p-4">
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg bg-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-300"
        >
          戻る
        </button>
        <h1 className="text-2xl font-bold text-gray-800">設定</h1>
      </div>

      <div className="space-y-4">
        <ApiKeyInput />
        <PdfImport />
        <ScheduleEditor />
        <NotificationSettings />
      </div>
    </div>
  );
}
