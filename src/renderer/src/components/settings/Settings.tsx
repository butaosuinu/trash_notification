import { ArrowLeft } from "lucide-react";
import { ICON_SIZE } from "../../constants/styles";
import { IconButton } from "../common/IconButton";
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
      <div className="glass-titlebar titlebar-drag sticky top-0 z-10 flex items-center gap-3 pb-3 pl-16 pr-4 pt-3">
        <div className="titlebar-no-drag">
          <IconButton
            variant="nav"
            onClick={onBack}
            icon={<ArrowLeft size={ICON_SIZE} />}
            label="戻る"
          />
        </div>
        <h1 className="font-heading text-2xl font-bold text-frost-text">設定</h1>
      </div>

      <div className="space-y-4 p-4">
        <ApiKeyInput />
        <PdfImport />
        <ScheduleEditor />
        <NotificationSettings />
      </div>
    </div>
  );
}
