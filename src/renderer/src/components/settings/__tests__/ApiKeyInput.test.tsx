import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiKeyInput } from "../ApiKeyInput";
import { AUTOSAVE_DELAY_MS } from "../../../constants/schedule";

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

  it("初回ロード時にsetApiKeyが呼ばれない", async () => {
    vi.mocked(window.electronAPI.getApiKey).mockResolvedValue("existing-key");

    render(<ApiKeyInput />);

    await screen.findByDisplayValue("existing-key");
    vi.advanceTimersByTime(AUTOSAVE_DELAY_MS);

    expect(window.electronAPI.setApiKey).not.toHaveBeenCalled();
  });

  it("APIキー変更後にデバウンスで自動保存される", async () => {
    vi.mocked(window.electronAPI.getApiKey).mockResolvedValue(null);
    vi.mocked(window.electronAPI.setApiKey).mockResolvedValue(undefined);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(<ApiKeyInput />);

    await waitFor(() => {
      expect(window.electronAPI.getApiKey).toHaveBeenCalled();
    });

    const input = screen.getByPlaceholderText("API キーを入力");
    await user.type(input, "new-api-key");

    vi.advanceTimersByTime(AUTOSAVE_DELAY_MS);

    await waitFor(() => {
      expect(window.electronAPI.setApiKey).toHaveBeenCalledWith("new-api-key");
    });
  });
});
