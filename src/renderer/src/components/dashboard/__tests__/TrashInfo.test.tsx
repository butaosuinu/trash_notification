import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrashInfo } from "../TrashInfo";

describe("TrashInfo", () => {
  it("ゴミの種類が表示される", () => {
    render(<TrashInfo day={{ name: "燃えるゴミ", icon: "burn" }} />);
    expect(screen.getByText("燃えるゴミ")).toBeInTheDocument();
  });

  it("収集がない日はメッセージが表示される", () => {
    render(<TrashInfo day={{ name: "", icon: "" }} />);
    expect(screen.getByText("今日のゴミ回収はありません")).toBeInTheDocument();
  });

  it("day が undefined の場合は収集なしメッセージが表示される", () => {
    render(<TrashInfo day={undefined} />);
    expect(screen.getByText("今日のゴミ回収はありません")).toBeInTheDocument();
  });
});
