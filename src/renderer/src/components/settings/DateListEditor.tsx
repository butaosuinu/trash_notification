import { useState } from "react";
import { INPUT_CLASS } from "../../constants/styles";

type DateListEditorProps = { dates: string[]; onChange: (dates: string[]) => void };

export function DateListEditor({ dates, onChange }: DateListEditorProps) {
  const [newDate, setNewDate] = useState("");

  const handleAdd = () => {
    if (newDate === "" || dates.includes(newDate)) return;
    onChange([...dates, newDate].toSorted((a, b) => a.localeCompare(b)));
    setNewDate("");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={newDate}
          onChange={(e) => {
            setNewDate(e.target.value);
          }}
          className={INPUT_CLASS}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded bg-frost-accent/20 border border-frost-accent/40 px-2 py-1 text-xs text-frost-accent hover:bg-frost-accent/30 transition-all duration-150"
        >
          追加
        </button>
      </div>
      {dates.length > 0 && (
        <div className="max-h-32 space-y-1 overflow-y-auto">
          {dates.map((date) => (
            <div key={date} className="flex items-center gap-2 text-sm text-frost-text-secondary">
              <span>{date}</span>
              <button
                type="button"
                onClick={() => {
                  onChange(dates.filter((d) => d !== date));
                }}
                className="text-red-400 hover:text-red-300 transition-colors duration-150"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
