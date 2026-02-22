import { INPUT_CLASS } from "../../constants/styles";
import { useNotificationSettings } from "../../hooks/useNotificationSettings";
import { useSaveFeedback } from "../../hooks/useSaveFeedback";
import { Card } from "../common/Card";
import type { NotificationSettings as NotificationSettingsType } from "../../../../shared/types/notification";

type TimeInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function TimeInput({ label, value, onChange }: TimeInputProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-frost-text-secondary">{label}</span>
      <input
        type="time"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className={INPUT_CLASS}
      />
    </div>
  );
}

type NotificationFormProps = {
  settings: NotificationSettingsType;
  onSave: (settings: NotificationSettingsType) => void;
};

function NotificationForm({ settings, onSave }: NotificationFormProps) {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.enabled}
          onChange={(e) => {
            onSave({ ...settings, enabled: e.target.checked });
          }}
          className="rounded"
        />
        <span className="text-sm text-frost-text">通知を有効にする</span>
      </label>
      <TimeInput
        label="週間通知時刻:"
        value={settings.weeklyNotificationTime}
        onChange={(v) => {
          onSave({ ...settings, weeklyNotificationTime: v });
        }}
      />
      <TimeInput
        label="前日通知時刻:"
        value={settings.dayBeforeNotificationTime}
        onChange={(v) => {
          onSave({ ...settings, dayBeforeNotificationTime: v });
        }}
      />
    </div>
  );
}

export function NotificationSettings() {
  const { settings, saveSettings } = useNotificationSettings();
  const { showSavedFeedback } = useSaveFeedback();

  const handleSave = (newSettings: NotificationSettingsType) => {
    void saveSettings(newSettings).then(() => {
      showSavedFeedback();
    });
  };

  return (
    <Card title="通知設定">
      <NotificationForm settings={settings} onSave={handleSave} />
    </Card>
  );
}
