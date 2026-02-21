import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button";

const noop = vi.fn();

describe("Button", () => {
  it("children を描画する", () => {
    render(<Button onClick={noop}>テストボタン</Button>);
    expect(screen.getByText("テストボタン")).toBeInTheDocument();
  });

  it("クリック時に onClick が呼ばれる", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>クリック</Button>);
    await user.click(screen.getByText("クリック"));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("デフォルトの variant は primary", () => {
    render(<Button onClick={noop}>保存</Button>);
    const button = screen.getByText("保存");
    expect(button.className).toContain("bg-blue-500");
  });

  it("variant に応じたクラスが適用される", () => {
    render(
      <Button variant="secondary" onClick={noop}>
        キャンセル
      </Button>,
    );
    const button = screen.getByText("キャンセル");
    expect(button.className).toContain("bg-gray-200");
  });

  it("type 属性が button である", () => {
    render(<Button onClick={noop}>送信</Button>);
    expect(screen.getByText("送信")).toHaveAttribute("type", "button");
  });
});
