import type { ScheduleRule, NthWeekdayRule } from "../../types/schedule";
import { DAY_NAMES, RULE_TYPE_LABELS, WEEK_NUMBER_LABELS } from "../../constants/schedule";
import { DateListEditor } from "./DateListEditor";

const RULE_TYPES = ["weekly", "biweekly", "nthWeekday", "specificDates"] as const;
const INPUT_CLASS =
  "rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none";

function createDefaultRule(ruleType: string): ScheduleRule {
  switch (ruleType) {
    case "biweekly":
      return { type: "biweekly", dayOfWeek: 0, referenceDate: "" };
    case "nthWeekday":
      return { type: "nthWeekday", dayOfWeek: 0, weekNumbers: [1] };
    case "specificDates":
      return { type: "specificDates", dates: [] };
    default:
      return { type: "weekly", dayOfWeek: 0 };
  }
}

function DayOfWeekSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => {
        onChange(Number(e.target.value));
      }}
      className={INPUT_CLASS}
    >
      {DAY_NAMES.map((name, i) => (
        <option key={name} value={i}>
          {name}
        </option>
      ))}
    </select>
  );
}

type WeekNumberPickerProps = { rule: NthWeekdayRule; onChange: (rule: ScheduleRule) => void };

function WeekNumberPicker({ rule, onChange }: WeekNumberPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {WEEK_NUMBER_LABELS.map((label, i) => {
        const weekNum = i + 1;
        const checked = rule.weekNumbers.includes(weekNum);
        return (
          <label key={label} className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => {
                const updated = checked
                  ? rule.weekNumbers.filter((n) => n !== weekNum)
                  : [...rule.weekNumbers, weekNum].toSorted((a, b) => a - b);
                onChange({ ...rule, weekNumbers: updated });
              }}
            />
            {label}
          </label>
        );
      })}
    </div>
  );
}

type RuleEditorProps = { rule: ScheduleRule; onChange: (rule: ScheduleRule) => void };

export function RuleEditor({ rule, onChange }: RuleEditorProps) {
  const handleTypeChange = (newType: string) => {
    if (newType === rule.type) return;
    const newRule = createDefaultRule(newType);
    if ("dayOfWeek" in rule && "dayOfWeek" in newRule) {
      (newRule as { dayOfWeek: number }).dayOfWeek = rule.dayOfWeek;
    }
    onChange(newRule);
  };

  return (
    <div className="space-y-2">
      <select
        value={rule.type}
        onChange={(e) => {
          handleTypeChange(e.target.value);
        }}
        className={INPUT_CLASS}
      >
        {RULE_TYPES.map((rt) => (
          <option key={rt} value={rt}>
            {RULE_TYPE_LABELS[rt]}
          </option>
        ))}
      </select>
      {rule.type === "weekly" && (
        <DayOfWeekSelect
          value={rule.dayOfWeek}
          onChange={(v) => {
            onChange({ ...rule, dayOfWeek: v });
          }}
        />
      )}
      {rule.type === "biweekly" && (
        <div className="flex items-center gap-2">
          <DayOfWeekSelect
            value={rule.dayOfWeek}
            onChange={(v) => {
              onChange({ ...rule, dayOfWeek: v });
            }}
          />
          <input
            type="date"
            value={rule.referenceDate}
            onChange={(e) => {
              onChange({ ...rule, referenceDate: e.target.value });
            }}
            className={INPUT_CLASS}
          />
        </div>
      )}
      {rule.type === "nthWeekday" && (
        <div className="space-y-1">
          <DayOfWeekSelect
            value={rule.dayOfWeek}
            onChange={(v) => {
              onChange({ ...rule, dayOfWeek: v });
            }}
          />
          <WeekNumberPicker rule={rule} onChange={onChange} />
        </div>
      )}
      {rule.type === "specificDates" && (
        <DateListEditor
          dates={rule.dates}
          onChange={(dates) => {
            onChange({ ...rule, dates });
          }}
        />
      )}
    </div>
  );
}
