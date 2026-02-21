import { format, getDay } from "date-fns";
import { ja } from "date-fns/locale";

export function formatDateTime(date: Date): string {
  return format(date, "yyyy年MM月dd日 HH:mm:ss EEEE", { locale: ja });
}

export function formatDayGreeting(date: Date): string {
  const dayName = format(date, "EEEE", { locale: ja });
  return `今日は${dayName}ですよー！！`;
}

export function getTodayDayOfWeek(date: Date): number {
  return getDay(date);
}

export function formatDateToISO(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
