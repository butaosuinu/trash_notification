import { useState, useEffect } from "react";
import { useSchedule } from "../../hooks/useSchedule";
import { TRASH_ICONS, TRASH_ICON_LABELS, SAVE_FEEDBACK_DELAY_MS } from "../../constants/schedule";
import type { ScheduleEntry, ScheduleRule } from "../../types/schedule";
import { SCHEDULE_VERSION } from "../../types/schedule";
import { RuleEditor } from "./RuleEditor";
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

type ScheduleActionsProps = {
  onAdd: () => void;
  onSave: () => void;
  saved: boolean;
};

function ScheduleActions({ onAdd, onSave, saved }: ScheduleActionsProps) {
  return (
    <div className="mt-3 flex gap-2">
      <button
        type="button"
        onClick={onAdd}
        className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
      >
        エントリーを追加
      </button>
      <button
        type="button"
        onClick={onSave}
        className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
      >
        {saved ? "保存済み" : "保存"}
      </button>
    </div>
  );
}

type ScheduleEntryListProps = {
  entries: ScheduleEntry[];
  onUpdate: (id: string, updater: (e: ScheduleEntry) => ScheduleEntry) => void;
  onRemove: (id: string) => void;
};

function ScheduleEntryList({ entries, onUpdate, onRemove }: ScheduleEntryListProps) {
  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <EntryRow
          key={entry.id}
          entry={entry}
          onNameChange={(name) => {
            onUpdate(entry.id, (e) => ({ ...e, trash: { ...e.trash, name } }));
          }}
          onIconChange={(icon) => {
            onUpdate(entry.id, (e) => ({ ...e, trash: { ...e.trash, icon } }));
          }}
          onRuleChange={(rule) => {
            onUpdate(entry.id, (e) => ({ ...e, rule }));
          }}
          onRemove={() => {
            onRemove(entry.id);
          }}
        />
      ))}
    </div>
  );
}

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
              {iconKey === "" ? "なし" : `${TRASH_ICONS[iconKey]} ${TRASH_ICON_LABELS[iconKey]}`}
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
      <ScheduleEntryList
        entries={entries}
        onUpdate={updateEntry}
        onRemove={(id) => {
          setEntries((prev) => prev.filter((e) => e.id !== id));
        }}
      />
      <ScheduleActions
        onAdd={() => {
          setEntries((prev) => [...prev, createEmptyEntry()]);
        }}
        onSave={() => {
          void handleSave();
        }}
        saved={saved}
      />
    </div>
  );
}
