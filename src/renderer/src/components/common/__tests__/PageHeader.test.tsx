import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PageHeader } from "../PageHeader";

describe("PageHeader", () => {
  it("title を表示する", () => {
    render(<PageHeader title="テスト" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("テスト");
  });

  it("onBack が未指定の場合に戻るボタンを表示しない", () => {
    render(<PageHeader title="ホーム" />);
    expect(screen.queryByLabelText("戻る")).toBeNull();
  });

  it("onBack が指定された場合に戻るボタンを表示する", () => {
    render(<PageHeader title="設定" onBack={vi.fn()} />);
    expect(screen.getByLabelText("戻る")).toBeInTheDocument();
  });

  it("戻るボタンをクリックすると onBack が呼ばれる", async () => {
    const onBack = vi.fn();
    render(<PageHeader title="設定" onBack={onBack} />);
    await userEvent.click(screen.getByLabelText("戻る"));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("subtitle が指定された場合に表示する", () => {
    render(<PageHeader title="ホーム" subtitle={<span data-testid="subtitle">2月22日</span>} />);
    expect(screen.getByTestId("subtitle")).toHaveTextContent("2月22日");
  });

  it("trailing が指定された場合に表示する", () => {
    render(<PageHeader title="ホーム" trailing={<button type="button">ナビ</button>} />);
    expect(screen.getByRole("button", { name: "ナビ" })).toBeInTheDocument();
  });

  it("onBack が未指定の場合に pl-16 と justify-between が適用される", () => {
    render(<PageHeader title="ホーム" />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("pl-16", "justify-between");
    expect(header).not.toHaveClass("pl-20", "gap-3");
  });

  it("onBack が指定された場合に pl-20 と gap-3 が適用される", () => {
    render(<PageHeader title="設定" onBack={vi.fn()} />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("pl-20", "gap-3");
    expect(header).not.toHaveClass("pl-16", "justify-between");
  });
});
