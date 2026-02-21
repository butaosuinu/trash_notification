import { useDateTime } from "../../hooks/useDateTime";
import { formatDateTime, formatDayGreeting } from "../../utils/dateUtils";

export function DateTimeDisplay() {
  const now = useDateTime();

  return (
    <div className="text-center">
      <p className="font-heading text-lg font-medium text-frost-text">{formatDateTime(now)}</p>
      <p className="mt-1 text-sm font-medium text-gradient-blue">{formatDayGreeting(now)}</p>
    </div>
  );
}
