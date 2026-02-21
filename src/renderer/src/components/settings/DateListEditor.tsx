import { Plus, X } from "lucide-react";
import { useState } from "react";
import { ICON_SIZE_SM, ICON_SIZE_XS, INPUT_CLASS } from "../../constants/styles";
import { IconButton } from "../common/IconButton";

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
        <IconButton onClick={handleAdd} icon={<Plus size={ICON_SIZE_SM} />} label="追加" />
      </div>
      {dates.length > 0 && (
        <div className="max-h-32 space-y-1 overflow-y-auto">
          {dates.map((date) => (
            <div key={date} className="flex items-center gap-2 text-sm text-frost-text-secondary">
              <span>{date}</span>
              <IconButton
                variant="danger-ghost"
                onClick={() => {
                  onChange(dates.filter((d) => d !== date));
                }}
                icon={<X size={ICON_SIZE_XS} />}
                label="削除"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
