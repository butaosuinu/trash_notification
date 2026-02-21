import { Button } from "../common/Button";
import { ApiKeyInput } from "./ApiKeyInput";
import { PdfImport } from "./PdfImport";
import { ScheduleEditor } from "./ScheduleEditor";
import { NotificationSettings } from "./NotificationSettings";

type SettingsProps = {
  onBack: () => void;
};

export function Settings({ onBack }: SettingsProps) {
  return (
    <div className="flex h-screen flex-col p-4 pt-2">
      <div className="titlebar-drag mb-4 flex items-center gap-3 pl-16 pt-1">
        <div className="titlebar-no-drag">
          <Button variant="nav" onClick={onBack}>
            戻る
          </Button>
        </div>
        <h1 className="font-heading text-2xl font-bold text-frost-text">設定</h1>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        <ApiKeyInput />
        <PdfImport />
        <ScheduleEditor />
        <NotificationSettings />
      </div>
    </div>
  );
}
