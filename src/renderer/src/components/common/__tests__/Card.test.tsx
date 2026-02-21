import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "../Card";

describe("Card", () => {
  it("children を描画する", () => {
    render(
      <Card>
        <p>テスト内容</p>
      </Card>,
    );
    expect(screen.getByText("テスト内容")).toBeInTheDocument();
  });

  it("title が指定された場合に見出しを表示する", () => {
    render(
      <Card title="テストタイトル">
        <p>内容</p>
      </Card>,
    );
    expect(screen.getByText("テストタイトル")).toBeInTheDocument();
  });

  it("title が未指定の場合に見出しを表示しない", () => {
    render(
      <Card>
        <p>内容のみ</p>
      </Card>,
    );
    expect(screen.queryByRole("heading")).toBeNull();
  });

  it("デフォルトで h3 を使用する", () => {
    render(
      <Card title="デフォルト見出し">
        <p>内容</p>
      </Card>,
    );
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("デフォルト見出し");
  });

  it("titleAs で見出しレベルを変更できる", () => {
    render(
      <Card title="H2 見出し" titleAs="h2">
        <p>内容</p>
      </Card>,
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("H2 見出し");
  });

  it("titleClassName でカスタムクラスを適用できる", () => {
    render(
      <Card title="カスタム" titleClassName="mb-3 text-lg">
        <p>内容</p>
      </Card>,
    );
    const heading = screen.getByRole("heading");
    expect(heading).toHaveClass("mb-3", "text-lg");
  });
});
