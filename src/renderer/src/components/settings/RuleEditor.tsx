import type {
  ScheduleRule,
  BiweeklyRule,
  NthWeekdayRule,
  NthWeekdayPattern,
} from "../../types/schedule";
import { DAY_NAMES, RULE_TYPE_LABELS, WEEK_NUMBER_LABELS } from "../../constants/schedule";
import { DateListEditor } from "./DateListEditor";
import { INPUT_CLASS } from "../../constants/styles";

const RULE_TYPES = ["weekly", "biweekly", "nthWeekday", "specificDates"] as const;

function createDefaultRule(ruleType: string): ScheduleRule {
  switch (ruleType) {
    case "biweekly":
      return { type: "biweekly", dayOfWeek: 0, referenceDate: "" };
    case "nthWeekday":
      return { type: "nthWeekday", patterns: [{ dayOfWeek: 0, weekNumbers: [1] }] };
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

type WeekNumberPickerProps = {
  weekNumbers: number[];
  onChange: (weekNumbers: number[]) => void;
};

function WeekNumberPicker({ weekNumbers, onChange }: WeekNumberPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {WEEK_NUMBER_LABELS.map((label, i) => {
        const weekNum = i + 1;
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
                onChange(updated);
              }}
            />
            {label}
          </label>
        );
      })}
    </div>
  );
}

type PatternRowProps = {
  pattern: NthWeekdayPattern;
  onPatternChange: (pattern: NthWeekdayPattern) => void;
  onRemove: (() => void) | null;
};

function NthWeekdayPatternRow({ pattern, onPatternChange, onRemove }: PatternRowProps) {
  return (
    <div className="space-y-1 rounded border border-frost-glass-border p-2">
      <div className="flex items-center gap-2">
        <DayOfWeekSelect
          value={pattern.dayOfWeek}
          onChange={(v) => {
            onPatternChange({ ...pattern, dayOfWeek: v });
          }}
        />
        {onRemove !== null && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-frost-danger hover:text-frost-danger/80"
          >
            削除
          </button>
        )}
      </div>
      <WeekNumberPicker
        weekNumbers={pattern.weekNumbers}
        onChange={(weekNumbers) => {
          onPatternChange({ ...pattern, weekNumbers });
        }}
      />
    </div>
  );
}

type NthWeekdayFieldsProps = { rule: NthWeekdayRule; onChange: (rule: ScheduleRule) => void };

function NthWeekdayFields({ rule, onChange }: NthWeekdayFieldsProps) {
  const updatePattern = (index: number, pattern: NthWeekdayPattern) => {
    const updated = rule.patterns.map((p, i) => (i === index ? pattern : p));
    onChange({ ...rule, patterns: updated });
  };

  const removePattern = (index: number) => {
    onChange({ ...rule, patterns: rule.patterns.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-2">
      {rule.patterns.map((pattern, index) => (
        <NthWeekdayPatternRow
          key={index}
          pattern={pattern}
          onPatternChange={(p) => {
            updatePattern(index, p);
          }}
          onRemove={
            rule.patterns.length > 1
              ? () => {
                  removePattern(index);
                }
              : null
          }
        />
      ))}
      <button
        type="button"
        onClick={() => {
          onChange({ ...rule, patterns: [...rule.patterns, { dayOfWeek: 0, weekNumbers: [1] }] });
        }}
        className="text-xs text-frost-accent hover:text-frost-accent/80"
      >
        + パターンを追加
      </button>
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
      return <NthWeekdayFields rule={rule} onChange={onChange} />;
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

function getDayOfWeekFromRule(rule: ScheduleRule): number | null {
  if (rule.type === "nthWeekday") return rule.patterns[0]?.dayOfWeek ?? null;
  if ("dayOfWeek" in rule) return rule.dayOfWeek;
  return null;
}

type RuleEditorProps = { rule: ScheduleRule; onChange: (rule: ScheduleRule) => void };

export function RuleEditor({ rule, onChange }: RuleEditorProps) {
  const handleTypeChange = (newType: string) => {
    if (newType === rule.type) return;
    const sourceDayOfWeek = getDayOfWeekFromRule(rule);
    const defaultRule = createDefaultRule(newType);
    if (sourceDayOfWeek !== null && newType === "nthWeekday") {
      onChange({
        type: "nthWeekday",
        patterns: [{ dayOfWeek: sourceDayOfWeek, weekNumbers: [1] }],
      });
      return;
    }
    if (sourceDayOfWeek !== null && "dayOfWeek" in defaultRule) {
      onChange({ ...defaultRule, dayOfWeek: sourceDayOfWeek });
      return;
    }
    onChange(defaultRule);
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
