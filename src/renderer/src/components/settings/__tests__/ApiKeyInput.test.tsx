import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiKeyInput } from "../ApiKeyInput";

describe("ApiKeyInput", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("マウント時に既存のAPIキーを読み込んで表示する", async () => {
    vi.mocked(window.electronAPI.getApiKey).mockResolvedValue("test-api-key");

    render(<ApiKeyInput />);

    await screen.findByDisplayValue("test-api-key");
  });

  it("APIキーが未設定の場合は空のまま", async () => {
    vi.mocked(window.electronAPI.getApiKey).mockResolvedValue(null);

    render(<ApiKeyInput />);

    await waitFor(() => {
      expect(window.electronAPI.getApiKey).toHaveBeenCalled();
    });

    expect(screen.getByPlaceholderText("API キーを入力")).toHaveValue("");
  });

  it("APIキーを入力して保存できる", async () => {
    vi.mocked(window.electronAPI.getApiKey).mockResolvedValue(null);
    vi.mocked(window.electronAPI.setApiKey).mockResolvedValue(undefined);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(<ApiKeyInput />);

    const input = screen.getByPlaceholderText("API キーを入力");
    await user.type(input, "new-api-key");
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(window.electronAPI.setApiKey).toHaveBeenCalledWith("new-api-key");
  });

  it("保存後に保存済みフィードバックが表示される", async () => {
    vi.mocked(window.electronAPI.getApiKey).mockResolvedValue(null);
    vi.mocked(window.electronAPI.setApiKey).mockResolvedValue(undefined);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(<ApiKeyInput />);

    const input = screen.getByPlaceholderText("API キーを入力");
    await user.type(input, "key");
    await user.click(screen.getByRole("button", { name: "保存" }));

    await screen.findByRole("button", { name: "保存済み" });
  });
});
