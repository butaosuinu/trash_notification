import { describe, it, expect } from "vitest";
import { doesRuleMatch, getTodayEntries } from "../scheduleMatch";
import type {
  WeeklyRule,
  BiweeklyRule,
  NthWeekdayRule,
  SpecificDatesRule,
  ScheduleEntry,
} from "../../types/schedule";

describe("doesRuleMatch", () => {
  describe("weekly", () => {
    const rule: WeeklyRule = { type: "weekly", dayOfWeek: 4 };

    it("木曜日にマッチする", () => {
      const thursday = new Date(2026, 1, 19);
      expect(doesRuleMatch(thursday, rule)).toBe(true);
    });

    it("金曜日にはマッチしない", () => {
      const friday = new Date(2026, 1, 20);
      expect(doesRuleMatch(friday, rule)).toBe(false);
    });

    it("日曜日のルールが日曜日にマッチする", () => {
      const sundayRule: WeeklyRule = { type: "weekly", dayOfWeek: 0 };
      const sunday = new Date(2026, 1, 15);
      expect(doesRuleMatch(sunday, sundayRule)).toBe(true);
    });

    it("土曜日のルールが土曜日にマッチする", () => {
      const saturdayRule: WeeklyRule = { type: "weekly", dayOfWeek: 6 };
      const saturday = new Date(2026, 1, 21);
      expect(doesRuleMatch(saturday, saturdayRule)).toBe(true);
    });
  });

  describe("biweekly", () => {
    const rule: BiweeklyRule = {
      type: "biweekly",
      dayOfWeek: 2,
      referenceDate: "2026-02-17",
    };

    it("基準日にマッチする", () => {
      const refDate = new Date(2026, 1, 17);
      expect(doesRuleMatch(refDate, rule)).toBe(true);
    });

    it("2週間後にマッチする", () => {
      const twoWeeksLater = new Date(2026, 2, 3);
      expect(doesRuleMatch(twoWeeksLater, rule)).toBe(true);
    });

    it("1週間後にはマッチしない", () => {
      const oneWeekLater = new Date(2026, 1, 24);
      expect(doesRuleMatch(oneWeekLater, rule)).toBe(false);
    });

    it("3週間後にはマッチしない", () => {
      const threeWeeksLater = new Date(2026, 2, 10);
      expect(doesRuleMatch(threeWeeksLater, rule)).toBe(false);
    });

    it("4週間後にマッチする", () => {
      const fourWeeksLater = new Date(2026, 2, 17);
      expect(doesRuleMatch(fourWeeksLater, rule)).toBe(true);
    });

    it("曜日が違う日にはマッチしない", () => {
      const wednesday = new Date(2026, 1, 18);
      expect(doesRuleMatch(wednesday, rule)).toBe(false);
    });

    it("年またぎでも正しく判定する", () => {
      const yearEndRule: BiweeklyRule = {
        type: "biweekly",
        dayOfWeek: 1,
        referenceDate: "2025-12-29",
      };
      const twoWeeksIntoNewYear = new Date(2026, 0, 12);
      expect(doesRuleMatch(twoWeeksIntoNewYear, yearEndRule)).toBe(true);
    });
  });

  describe("nthWeekday", () => {
    const rule: NthWeekdayRule = {
      type: "nthWeekday",
      dayOfWeek: 3,
      weekNumbers: [1, 3],
    };

    it("第1水曜日にマッチする", () => {
      const firstWed = new Date(2026, 1, 4);
      expect(doesRuleMatch(firstWed, rule)).toBe(true);
    });

    it("第3水曜日にマッチする", () => {
      const thirdWed = new Date(2026, 1, 18);
      expect(doesRuleMatch(thirdWed, rule)).toBe(true);
    });

    it("第2水曜日にはマッチしない", () => {
      const secondWed = new Date(2026, 1, 11);
      expect(doesRuleMatch(secondWed, rule)).toBe(false);
    });

    it("第4水曜日にはマッチしない", () => {
      const fourthWed = new Date(2026, 1, 25);
      expect(doesRuleMatch(fourthWed, rule)).toBe(false);
    });

    it("水曜日でない日にはマッチしない", () => {
      const thursday = new Date(2026, 1, 5);
      expect(doesRuleMatch(thursday, rule)).toBe(false);
    });

    it("第5週が存在する月の第5曜日を判定する", () => {
      const fifthRule: NthWeekdayRule = {
        type: "nthWeekday",
        dayOfWeek: 5,
        weekNumbers: [5],
      };
      const fifthFriday = new Date(2026, 0, 30);
      expect(doesRuleMatch(fifthFriday, fifthRule)).toBe(true);
    });

    it("月の最初の日が第1週になる", () => {
      const firstDayRule: NthWeekdayRule = {
        type: "nthWeekday",
        dayOfWeek: 0,
        weekNumbers: [1],
      };
      const firstSunday = new Date(2026, 2, 1);
      expect(doesRuleMatch(firstSunday, firstDayRule)).toBe(true);
    });
  });

  describe("specificDates", () => {
    const rule: SpecificDatesRule = {
      type: "specificDates",
      dates: ["2026-02-20", "2026-03-15", "2026-04-10"],
    };

    it("リスト内の日付にマッチする", () => {
      const date = new Date(2026, 1, 20);
      expect(doesRuleMatch(date, rule)).toBe(true);
    });

    it("リストにない日付にはマッチしない", () => {
      const date = new Date(2026, 1, 21);
      expect(doesRuleMatch(date, rule)).toBe(false);
    });

    it("空のリストにはマッチしない", () => {
      const emptyRule: SpecificDatesRule = { type: "specificDates", dates: [] };
      const date = new Date(2026, 1, 20);
      expect(doesRuleMatch(date, emptyRule)).toBe(false);
    });

    it("リスト内の別の日付にもマッチする", () => {
      const date = new Date(2026, 2, 15);
      expect(doesRuleMatch(date, rule)).toBe(true);
    });
  });
});

describe("getTodayEntries", () => {
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
    {
      id: "3",
      trash: { name: "粗大ゴミ", icon: "" },
      rule: { type: "specificDates", dates: ["2026-02-19"] },
    },
  ];

  it("該当するエントリーのみ返す", () => {
    const thursday = new Date(2026, 1, 19);
    const result = getTodayEntries(thursday, entries);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("2");
    expect(result[1].id).toBe("3");
  });

  it("該当なしの場合は空配列を返す", () => {
    const monday = new Date(2026, 1, 16);
    const result = getTodayEntries(monday, entries);
    expect(result).toHaveLength(0);
  });

  it("空のエントリーリストでも動作する", () => {
    const date = new Date(2026, 1, 19);
    const result = getTodayEntries(date, []);
    expect(result).toHaveLength(0);
  });
});
