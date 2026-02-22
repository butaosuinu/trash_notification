import { PlusCircle, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { ICON_SIZE, INPUT_CLASS } from "../../constants/styles";
import { AUTOSAVE_DELAY_MS, TRASH_ICONS, TRASH_ICON_LABELS } from "../../constants/schedule";
import { useSchedule } from "../../hooks/useSchedule";
import { useSaveFeedback } from "../../hooks/useSaveFeedback";
import type { ScheduleEntry, ScheduleRule } from "../../types/schedule";
import { SCHEDULE_VERSION } from "../../types/schedule";
import { RuleEditor } from "./RuleEditor";
import { IconButton } from "../common/IconButton";
import { Card } from "../common/Card";
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

function ScheduleActions({ onAdd }: { readonly onAdd: () => void }) {
  return (
    <div className="mt-3 flex gap-2">
      <IconButton
        variant="secondary"
        onClick={onAdd}
        icon={<PlusCircle size={ICON_SIZE} />}
        label="エントリーを追加"
      />
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
    <div className="rounded border border-frost-glass-border bg-frost-glass p-3">
      <div className="mb-2 flex items-center gap-2">
        <input
          type="text"
          value={entry.trash.name}
          onChange={(e) => {
            onNameChange(e.target.value);
          }}
          placeholder="ゴミの種類"
          className={`flex-1 ${INPUT_CLASS}`}
        />
        <select
          value={entry.trash.icon}
          onChange={(e) => {
            onIconChange(e.target.value);
          }}
          className={INPUT_CLASS}
        >
          {ICON_OPTIONS.map((iconKey) => (
            <option key={iconKey} value={iconKey}>
              {iconKey === "" ? "なし" : `${TRASH_ICONS[iconKey]} ${TRASH_ICON_LABELS[iconKey]}`}
            </option>
          ))}
        </select>
        <IconButton
          variant="danger-ghost"
          onClick={onRemove}
          icon={<Trash2 size={ICON_SIZE} />}
          label="削除"
        />
      </div>
      <RuleEditor rule={entry.rule} onChange={onRuleChange} />
    </div>
  );
}

export function ScheduleEditor() {
  const { schedule, saveSchedule } = useSchedule();
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [lastSavedEntries, setLastSavedEntries] = useState<ScheduleEntry[]>([]);
  const { showSavedFeedback } = useSaveFeedback();

  useEffect(() => {
    setLastSavedEntries(schedule.entries);
    setEntries(schedule.entries);
  }, [schedule]);

  useEffect(() => {
    if (entries === lastSavedEntries) return;

    const timer = setTimeout(() => {
      void saveSchedule({ version: SCHEDULE_VERSION, entries }).then(() => {
        setLastSavedEntries(entries);
        showSavedFeedback();
      });
    }, AUTOSAVE_DELAY_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [entries, lastSavedEntries, saveSchedule, showSavedFeedback]);

  const updateEntry = (id: string, updater: (e: ScheduleEntry) => ScheduleEntry) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? updater(e) : e)));
  };

  return (
    <Card title="スケジュール編集">
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
      />
    </Card>
  );
}
