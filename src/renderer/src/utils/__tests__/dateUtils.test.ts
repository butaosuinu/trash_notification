import { describe, it, expect } from "vitest";
import { formatDateTime, formatDayGreeting, getTodayDayOfWeek } from "../dateUtils";

describe("dateUtils", () => {
  it("formatDateTime は日本語形式の日時文字列を返す", () => {
    const date = new Date(2026, 1, 19, 14, 30, 45);
    const result = formatDateTime(date);
    expect(result).toBe("2026年02月19日 14:30:45 木曜日");
  });

  it("formatDayGreeting は曜日の挨拶を返す", () => {
    const date = new Date(2026, 1, 19);
    const result = formatDayGreeting(date);
    expect(result).toBe("今日は木曜日ですよー！！");
  });

  it("getTodayDayOfWeek は曜日番号を返す", () => {
    const sunday = new Date(2026, 1, 15);
    expect(getTodayDayOfWeek(sunday)).toBe(0);

    const thursday = new Date(2026, 1, 19);
    expect(getTodayDayOfWeek(thursday)).toBe(4);
  });
});
