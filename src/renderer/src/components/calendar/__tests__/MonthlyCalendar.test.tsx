import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "jotai";
import { MonthlyCalendar } from "../MonthlyCalendar";
import type { TrashSchedule } from "../../../types/schedule";

const TUESDAY = 2;
const FRIDAY = 5;

const mockSchedule: TrashSchedule = {
  version: 2,
  entries: [
    {
      id: "1",
      trash: { name: "燃えるゴミ", icon: "burn" },
      rule: { type: "weekly", dayOfWeek: TUESDAY },
    },
    {
      id: "2",
      trash: { name: "プラスチック", icon: "plastic" },
      rule: {
        type: "nthWeekday",
        patterns: [{ dayOfWeek: FRIDAY, weekNumbers: [1, 3] }],
      },
    },
  ],
};

function renderCalendar(onBack = vi.fn()) {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  render(
    <Provider>
      <MonthlyCalendar onBack={onBack} />
    </Provider>,
  );
  return { user, onBack };
}

function countTooltipsByLabel(label: string): number {
  return screen.getAllByRole("tooltip").filter((el) => el.textContent === label).length;
}

function expectDayHeadersVisible() {
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  dayNames.forEach((name) => {
    expect(screen.getByText(name)).toBeInTheDocument();
  });
}

function expectAllDaysInMonth(days: number) {
  Array.from({ length: days }, (_, i) => i + 1).forEach((day) => {
    expect(screen.getAllByText(String(day)).length).toBeGreaterThanOrEqual(1);
  });
}

describe("MonthlyCalendar", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date(2026, 1, 17, 10, 0, 0));
    vi.mocked(window.electronAPI.getSchedule).mockResolvedValue(mockSchedule);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("初期表示", () => {
    it("カレンダー見出しが表示される", () => {
      renderCalendar();

      expect(screen.getByRole("heading", { name: "カレンダー" })).toBeInTheDocument();
    });

    it("現在月のタイトルが表示される", async () => {
      renderCalendar();

      expect(await screen.findByRole("heading", { name: "2026年2月" })).toBeInTheDocument();
    });

    it("曜日ヘッダーが表示される", () => {
      renderCalendar();

      expectDayHeadersVisible();
    });

    it("当月の全日付が表示される", async () => {
      renderCalendar();

      await screen.findByRole("heading", { name: "2026年2月" });

      const FEB_DAYS = 28;
      expectAllDaysInMonth(FEB_DAYS);
    });
  });

  describe("スケジュール表示", () => {
    // 2026年2月グリッド: 2/1(日)～3/14(土) の42セル
    // 火曜: 2/3, 2/10, 2/17, 2/24, 3/3, 3/10 → 6回
    it("weeklyルールのゴミが該当日にツールチップで表示される", async () => {
      renderCalendar();

      await screen.findAllByText("燃えるゴミ");

      const TUESDAYS_IN_GRID = 6;
      expect(countTooltipsByLabel("燃えるゴミ")).toBe(TUESDAYS_IN_GRID);
    });

    // 第1・第3金曜: 2/6(第1), 2/20(第3), 3/6(第1) → 3回
    it("nthWeekdayルールのゴミが該当日にツールチップで表示される", async () => {
      renderCalendar();

      await screen.findAllByText("プラスチック");

      const NTH_FRIDAYS_IN_GRID = 3;
      expect(countTooltipsByLabel("プラスチック")).toBe(NTH_FRIDAYS_IN_GRID);
    });

    it("スケジュールが空の場合はゴミのツールチップが表示されない", async () => {
      vi.mocked(window.electronAPI.getSchedule).mockResolvedValue({
        version: 2,
        entries: [],
      });

      renderCalendar();

      await screen.findByRole("heading", { name: "2026年2月" });
      expect(screen.queryByText("燃えるゴミ")).not.toBeInTheDocument();
      expect(screen.queryByText("プラスチック")).not.toBeInTheDocument();
    });
  });

  describe("月ナビゲーション", () => {
    it("前月ボタンで前月に移動する", async () => {
      const { user } = renderCalendar();

      await screen.findByRole("heading", { name: "2026年2月" });
      await user.click(screen.getByRole("button", { name: "前月" }));

      expect(screen.getByRole("heading", { name: "2026年1月" })).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "2026年2月" })).not.toBeInTheDocument();
    });

    it("翌月ボタンで翌月に移動する", async () => {
      const { user } = renderCalendar();

      await screen.findByRole("heading", { name: "2026年2月" });
      await user.click(screen.getByRole("button", { name: "翌月" }));

      expect(screen.getByRole("heading", { name: "2026年3月" })).toBeInTheDocument();
    });

    it("今月ボタンで別月から現在月に戻る", async () => {
      const { user } = renderCalendar();

      await screen.findByRole("heading", { name: "2026年2月" });
      await user.click(screen.getByRole("button", { name: "前月" }));
      expect(screen.getByRole("heading", { name: "2026年1月" })).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "今月" }));
      expect(screen.getByRole("heading", { name: "2026年2月" })).toBeInTheDocument();
    });

    it("複数回ナビゲーションできる", async () => {
      const { user } = renderCalendar();

      await screen.findByRole("heading", { name: "2026年2月" });

      await user.click(screen.getByRole("button", { name: "翌月" }));
      await user.click(screen.getByRole("button", { name: "翌月" }));

      expect(screen.getByRole("heading", { name: "2026年4月" })).toBeInTheDocument();
    });
  });

  describe("戻るボタン", () => {
    it("戻るボタンがonBackを呼ぶ", async () => {
      const onBack = vi.fn();
      const { user } = renderCalendar(onBack);

      await user.click(screen.getByRole("button", { name: "戻る" }));
      expect(onBack).toHaveBeenCalledOnce();
    });
  });

  describe("ナビゲーション後のスケジュール表示", () => {
    // 2026年3月グリッド: 3/1(日)～4/11(土) の42セル
    // 火曜: 3/3, 3/10, 3/17, 3/24, 3/31, 4/7 → 6回
    it("月移動後もスケジュールが正しく表示される", async () => {
      const { user } = renderCalendar();

      await screen.findAllByText("燃えるゴミ");
      await user.click(screen.getByRole("button", { name: "翌月" }));

      expect(screen.getByRole("heading", { name: "2026年3月" })).toBeInTheDocument();

      const TUESDAYS_IN_MARCH_GRID = 6;
      expect(countTooltipsByLabel("燃えるゴミ")).toBe(TUESDAYS_IN_MARCH_GRID);
    });
  });
});
