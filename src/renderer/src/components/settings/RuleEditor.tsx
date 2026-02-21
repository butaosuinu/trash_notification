import type { ScheduleRule, BiweeklyRule, NthWeekdayRule } from "../../types/schedule";
import { DAY_NAMES, RULE_TYPE_LABELS, WEEK_NUMBER_LABELS } from "../../constants/schedule";
import { DateListEditor } from "./DateListEditor";
import { INPUT_CLASS } from "../../constants/styles";

const RULE_TYPES = ["weekly", "biweekly", "nthWeekday", "specificDates"] as const;

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
        const weekNumbers = rule.weekNumbers ?? [];
        const checked = weekNumbers.includes(weekNum);
        return (
          <label key={label} className="flex items-center gap-1 text-sm text-frost-text-secondary">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => {
                const updated = checked
                  ? weekNumbers.filter((n) => n !== weekNum)
                  : [...weekNumbers, weekNum].toSorted((a, b) => a - b);
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

type BiweeklyFieldsProps = { rule: BiweeklyRule; onChange: (rule: ScheduleRule) => void };

function BiweeklyFields({ rule, onChange }: BiweeklyFieldsProps) {
  return (
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
  );
}

type RuleFieldsProps = { rule: ScheduleRule; onChange: (rule: ScheduleRule) => void };

function RuleFields({ rule, onChange }: RuleFieldsProps) {
  switch (rule.type) {
    case "weekly":
      return (
        <DayOfWeekSelect
          value={rule.dayOfWeek}
          onChange={(v) => {
            onChange({ ...rule, dayOfWeek: v });
          }}
        />
      );
    case "biweekly":
      return <BiweeklyFields rule={rule} onChange={onChange} />;
    case "nthWeekday":
      return (
        <div className="space-y-1">
          <DayOfWeekSelect
            value={rule.dayOfWeek}
            onChange={(v) => {
              onChange({ ...rule, dayOfWeek: v });
            }}
          />
          <WeekNumberPicker rule={rule} onChange={onChange} />
        </div>
      );
    case "specificDates":
      return (
        <DateListEditor
          dates={rule.dates}
          onChange={(dates) => {
            onChange({ ...rule, dates });
          }}
        />
      );
  }
}

type RuleEditorProps = { rule: ScheduleRule; onChange: (rule: ScheduleRule) => void };

export function RuleEditor({ rule, onChange }: RuleEditorProps) {
  const handleTypeChange = (newType: string) => {
    if (newType === rule.type) return;
    const defaultRule = createDefaultRule(newType);
    const newRule =
      "dayOfWeek" in rule && "dayOfWeek" in defaultRule
        ? { ...defaultRule, dayOfWeek: rule.dayOfWeek }
        : defaultRule;
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
      <RuleFields rule={rule} onChange={onChange} />
    </div>
  );
}
