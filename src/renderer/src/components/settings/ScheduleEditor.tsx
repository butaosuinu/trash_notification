import { useState, useEffect } from "react";
import { useSchedule } from "../../hooks/useSchedule";
import { DAY_NAMES, TRASH_ICONS, SAVE_FEEDBACK_DELAY_MS } from "../../constants/schedule";
import type { TrashSchedule } from "../../types/schedule";

export function ScheduleEditor() {
  const { schedule, saveSchedule } = useSchedule();
  const [editSchedule, setEditSchedule] = useState<TrashSchedule>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setEditSchedule(schedule);
  }, [schedule]);

  const handleNameChange = (dayIndex: string, name: string) => {
    setEditSchedule((prev) => ({
      ...prev,
      [dayIndex]: {
        name,
        icon: prev[dayIndex]?.icon ?? "",
      },
    }));
  };

  const handleIconChange = (dayIndex: string, icon: string) => {
    setEditSchedule((prev) => ({
      ...prev,
      [dayIndex]: {
        name: prev[dayIndex]?.name ?? "",
        icon,
      },
    }));
  };

  const handleSave = async () => {
    await saveSchedule(editSchedule);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, SAVE_FEEDBACK_DELAY_MS);
  };

  const iconOptions = ["", ...Object.keys(TRASH_ICONS)];

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h3 className="mb-2 text-sm font-medium text-gray-500">スケジュール編集</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2 pr-2">曜日</th>
            <th className="py-2 pr-2">ゴミの種類</th>
            <th className="py-2">アイコン</th>
          </tr>
        </thead>
        <tbody>
          {DAY_NAMES.map((dayName, index) => {
            const dayIndex = String(index);
            const day = editSchedule[dayIndex];
            return (
              <tr key={dayName} className="border-b">
                <td className="py-2 pr-2 font-medium">{dayName}</td>
                <td className="py-2 pr-2">
                  <input
                    type="text"
                    value={day?.name ?? ""}
                    onChange={(e) => {
                      handleNameChange(dayIndex, e.target.value);
                    }}
                    placeholder="なし"
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </td>
                <td className="py-2">
                  <select
                    value={day?.icon ?? ""}
                    onChange={(e) => {
                      handleIconChange(dayIndex, e.target.value);
                    }}
                    className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    {iconOptions.map((iconKey) => (
                      <option key={iconKey} value={iconKey}>
                        {iconKey === "" ? "なし" : `${TRASH_ICONS[iconKey]} ${iconKey}`}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-3">
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
