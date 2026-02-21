import { useState } from "react";
import { useNotificationSettings } from "../../hooks/useNotificationSettings";
import { SAVE_FEEDBACK_DELAY_MS } from "../../constants/schedule";
import type { NotificationSettings as NotificationSettingsType } from "../../../../shared/types/notification";

type TimeInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function TimeInput({ label, value, onChange }: TimeInputProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">{label}</span>
      <input
        type="time"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}

type NotificationFormProps = {
  settings: NotificationSettingsType;
  onSave: (settings: NotificationSettingsType) => void;
  saved: boolean;
};

function NotificationForm({ settings, onSave, saved }: NotificationFormProps) {
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
        <span className="text-sm text-gray-700">通知を有効にする</span>
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
      <button
        type="button"
        onClick={() => {
          onSave(settings);
        }}
        className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
      >
        {saved ? "保存済み" : "保存"}
      </button>
    </div>
  );
}

export function NotificationSettings() {
  const { settings, saveSettings } = useNotificationSettings();
  const [saved, setSaved] = useState(false);

  const handleSave = (newSettings: NotificationSettingsType) => {
    void saveSettings(newSettings).then(() => {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
      }, SAVE_FEEDBACK_DELAY_MS);
    });
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h3 className="mb-2 text-sm font-medium text-gray-500">通知設定</h3>
      <NotificationForm settings={settings} onSave={handleSave} saved={saved} />
    </div>
  );
}
