import { PageHeader } from "../common/PageHeader";
import { ApiKeyInput } from "./ApiKeyInput";
import { PdfImport } from "./PdfImport";
import { ScheduleEditor } from "./ScheduleEditor";
import { NotificationSettings } from "./NotificationSettings";

type SettingsProps = {
  onBack: () => void;
};

export function Settings({ onBack }: SettingsProps) {
  return (
    <div className="h-screen overflow-y-auto">
      <PageHeader title="設定" onBack={onBack} />

      <div className="space-y-4 p-4">
        <ApiKeyInput />
        <PdfImport />
        <ScheduleEditor />
        <NotificationSettings />
      </div>
    </div>
  );
}
