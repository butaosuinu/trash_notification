// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  calcMsUntilNextTime,
  calcMsUntilNextWeekday,
  formatWeeklyBody,
  formatDayBeforeBody,
} from "../notificationService";
import type { ScheduleEntry } from "../../../shared/types/schedule";

vi.mock("electron", () => ({
  Notification: vi.fn().mockImplementation(() => ({ show: vi.fn() })),
  powerMonitor: { on: vi.fn() },
}));

vi.mock("electron-store", () => ({
  default: vi.fn().mockImplementation(() => ({
    get: vi.fn(),
    set: vi.fn(),
  })),
}));

vi.mock("../logger");
vi.mock("../scheduleStore");
vi.mock("../notificationStore");

const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 3_600_000;
const HOURS_PER_DAY = 24;

describe("notificationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("calcMsUntilNextTime", () => {
    it("今日の対象時刻がまだ来ていない場合、今日の残り時間を返す", () => {
      const now = new Date("2026-02-21T06:00:00");
      const ms = calcMsUntilNextTime(7, 0, now);
      expect(ms).toBe(MS_PER_HOUR);
    });

    it("対象時刻が過ぎている場合、翌日の対象時刻までの時間を返す", () => {
      const now = new Date("2026-02-21T08:00:00");
      const ms = calcMsUntilNextTime(7, 0, now);
      const hoursUntilTomorrow = 23;
      expect(ms).toBe(hoursUntilTomorrow * MS_PER_HOUR);
    });

    it("対象時刻ちょうどの場合、翌日の対象時刻までの時間を返す", () => {
      const now = new Date("2026-02-21T07:00:00");
      const ms = calcMsUntilNextTime(7, 0, now);
      expect(ms).toBe(HOURS_PER_DAY * MS_PER_HOUR);
    });

    it("分を含む時刻を正しく計算する", () => {
      const now = new Date("2026-02-21T19:30:00");
      const ms = calcMsUntilNextTime(20, 0, now);
      const minutesUntilTarget = 30;
      expect(ms).toBe(minutesUntilTarget * MS_PER_MINUTE);
    });
  });

  describe("calcMsUntilNextWeekday", () => {
    it("今週の対象曜日がまだ来ていない場合", () => {
      // 2026-02-21 = Saturday, target = Monday
      const now = new Date("2026-02-21T06:00:00");
      const monday = 1;
      const ms = calcMsUntilNextWeekday(monday, 7, 0, now);
      const daysUntilMonday = 2;
      const expectedMs = daysUntilMonday * HOURS_PER_DAY * MS_PER_HOUR + MS_PER_HOUR;
      expect(ms).toBe(expectedMs);
    });

    it("対象曜日の対象時刻前", () => {
      // 2026-02-23 = Monday
      const now = new Date("2026-02-23T06:00:00");
      const monday = 1;
      const ms = calcMsUntilNextWeekday(monday, 7, 0, now);
      expect(ms).toBe(MS_PER_HOUR);
    });

    it("対象曜日の対象時刻後は来週になる", () => {
      // 2026-02-23 = Monday
      const now = new Date("2026-02-23T08:00:00");
      const monday = 1;
      const ms = calcMsUntilNextWeekday(monday, 7, 0, now);
      const daysInWeek = 7;
      const expectedMs = daysInWeek * HOURS_PER_DAY * MS_PER_HOUR - MS_PER_HOUR;
      expect(ms).toBe(expectedMs);
    });
  });

  describe("formatWeeklyBody", () => {
    const entries: ScheduleEntry[] = [
      {
        id: "1",
        trash: { name: "燃えるゴミ", icon: "burn" },
        rule: { type: "weekly", dayOfWeek: 2 },
      },
      {
        id: "2",
        trash: { name: "資源ゴミ", icon: "recycle" },
        rule: { type: "weekly", dayOfWeek: 4 },
      },
    ];

    it("週のゴミ出しスケジュールをフォーマットする", () => {
      // 2026-02-23 = Monday
      const monday = new Date("2026-02-23");
      const body = formatWeeklyBody(entries, monday);
      expect(body).toContain("火曜日");
      expect(body).toContain("🔥 燃えるゴミ");
      expect(body).toContain("木曜日");
      expect(body).toContain("♻️ 資源ゴミ");
    });

    it("回収のない日は省略される", () => {
      const monday = new Date("2026-02-23");
      const body = formatWeeklyBody(entries, monday);
      expect(body).not.toContain("月曜日");
      expect(body).not.toContain("水曜日");
      expect(body).not.toContain("金曜日");
    });

    it("エントリーが空の場合は空文字列を返す", () => {
      const monday = new Date("2026-02-23");
      const body = formatWeeklyBody([], monday);
      expect(body).toBe("");
    });
  });

  describe("formatDayBeforeBody", () => {
    it("単一エントリーのフォーマット", () => {
      const entries: ScheduleEntry[] = [
        {
          id: "1",
          trash: { name: "燃えるゴミ", icon: "burn" },
          rule: { type: "weekly", dayOfWeek: 2 },
        },
      ];
      const body = formatDayBeforeBody(entries);
      expect(body).toBe("🔥 燃えるゴミ");
    });

    it("複数エントリーは読点で区切られる", () => {
      const entries: ScheduleEntry[] = [
        {
          id: "1",
          trash: { name: "燃えるゴミ", icon: "burn" },
          rule: { type: "weekly", dayOfWeek: 2 },
        },
        {
          id: "2",
          trash: { name: "資源ゴミ", icon: "recycle" },
          rule: { type: "weekly", dayOfWeek: 2 },
        },
      ];
      const body = formatDayBeforeBody(entries);
      expect(body).toBe("🔥 燃えるゴミ、♻️ 資源ゴミ");
    });

    it("アイコンが未設定の場合は名前のみ表示", () => {
      const entries: ScheduleEntry[] = [
        {
          id: "1",
          trash: { name: "カスタム", icon: "unknown" },
          rule: { type: "weekly", dayOfWeek: 2 },
        },
      ];
      const body = formatDayBeforeBody(entries);
      expect(body).toBe("カスタム");
    });
  });
});
