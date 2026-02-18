import { useDateTime } from "../../hooks/useDateTime";
import { formatDateTime, formatDayGreeting } from "../../utils/dateUtils";

export function DateTimeDisplay() {
  const now = useDateTime();

  return (
    <div className="text-center">
      <p className="text-lg text-gray-700">{formatDateTime(now)}</p>
      <p className="mt-1 text-sm font-medium text-blue-600">{formatDayGreeting(now)}</p>
    </div>
  );
}
