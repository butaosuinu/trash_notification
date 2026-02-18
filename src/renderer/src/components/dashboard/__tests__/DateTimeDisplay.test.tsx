import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { DateTimeDisplay } from "../DateTimeDisplay";

describe("DateTimeDisplay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 1, 19, 14, 30, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("日時が日本語形式で表示される", () => {
    render(<DateTimeDisplay />);
    expect(screen.getByText("2026年02月19日 14:30:00 木曜日")).toBeInTheDocument();
  });

  it("曜日の挨拶が表示される", () => {
    render(<DateTimeDisplay />);
    expect(screen.getByText("今日は木曜日ですよー！！")).toBeInTheDocument();
  });
});
