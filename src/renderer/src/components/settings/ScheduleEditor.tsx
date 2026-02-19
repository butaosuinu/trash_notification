import { useState, useEffect } from "react";
import { useSchedule } from "../../hooks/useSchedule";
import { TRASH_ICONS, SAVE_FEEDBACK_DELAY_MS } from "../../constants/schedule";
import type { ScheduleEntry, ScheduleRule } from "../../types/schedule";
import { RuleEditor } from "./RuleEditor";

const SCHEDULE_VERSION = 2;
const ICON_OPTIONS = ["", ...Object.keys(TRASH_ICONS)];

function createEmptyEntry(): ScheduleEntry {
  return {
    id: crypto.randomUUID(),
    trash: { name: "", icon: "" },
    rule: { type: "weekly", dayOfWeek: 0 },
  };
}

type EntryRowProps = {
  entry: ScheduleEntry;
  onNameChange: (name: string) => void;
  onIconChange: (icon: string) => void;
  onRuleChange: (rule: ScheduleRule) => void;
  onRemove: () => void;
};

function EntryRow({ entry, onNameChange, onIconChange, onRuleChange, onRemove }: EntryRowProps) {
  return (
    <div className="rounded border border-gray-200 p-3">
      <div className="mb-2 flex items-center gap-2">
        <input
          type="text"
          value={entry.trash.name}
          onChange={(e) => {
            onNameChange(e.target.value);
          }}
          placeholder="ゴミの種類"
          className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
        />
        <select
          value={entry.trash.icon}
          onChange={(e) => {
            onIconChange(e.target.value);
          }}
          className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
        >
          {ICON_OPTIONS.map((iconKey) => (
            <option key={iconKey} value={iconKey}>
              {iconKey === "" ? "なし" : `${TRASH_ICONS[iconKey]} ${iconKey}`}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onRemove}
          className="rounded px-2 py-1 text-sm text-red-400 hover:bg-red-50 hover:text-red-600"
        >
          削除
        </button>
      </div>
      <RuleEditor rule={entry.rule} onChange={onRuleChange} />
    </div>
  );
}

export function ScheduleEditor() {
  const { schedule, saveSchedule } = useSchedule();
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setEntries(schedule.entries);
  }, [schedule]);

  const updateEntry = (id: string, updater: (e: ScheduleEntry) => ScheduleEntry) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? updater(e) : e)));
  };

  const handleSave = async () => {
    await saveSchedule({ version: SCHEDULE_VERSION, entries });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, SAVE_FEEDBACK_DELAY_MS);
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h3 className="mb-2 text-sm font-medium text-gray-500">スケジュール編集</h3>
      <div className="space-y-3">
        {entries.map((entry) => (
          <EntryRow
            key={entry.id}
            entry={entry}
            onNameChange={(name) => {
              updateEntry(entry.id, (e) => ({ ...e, trash: { ...e.trash, name } }));
            }}
            onIconChange={(icon) => {
              updateEntry(entry.id, (e) => ({ ...e, trash: { ...e.trash, icon } }));
            }}
            onRuleChange={(rule) => {
              updateEntry(entry.id, (e) => ({ ...e, rule }));
            }}
            onRemove={() => {
              setEntries((prev) => prev.filter((e) => e.id !== entry.id));
            }}
          />
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setEntries((prev) => [...prev, createEmptyEntry()]);
          }}
          className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
        >
          エントリーを追加
        </button>
        <button
          type="button"
          onClick={() => {
            void handleSave();
          }}
          className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
        >
          {saved ? "保存済み" : "保存"}
        </button>
      </div>
    </div>
  );
}
