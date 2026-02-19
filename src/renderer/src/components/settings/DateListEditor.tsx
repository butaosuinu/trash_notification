import { useState } from "react";

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
          className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
        >
          追加
        </button>
      </div>
      {dates.length > 0 && (
        <div className="max-h-32 space-y-1 overflow-y-auto">
          {dates.map((date) => (
            <div key={date} className="flex items-center gap-2 text-sm text-gray-600">
              <span>{date}</span>
              <button
                type="button"
                onClick={() => {
                  onChange(dates.filter((d) => d !== date));
                }}
                className="text-red-400 hover:text-red-600"
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
