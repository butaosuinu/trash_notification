import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "jotai";
import { NotificationSettings } from "../NotificationSettings";

describe("NotificationSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("通知設定セクションが表示される", async () => {
    render(
      <Provider>
        <NotificationSettings />
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText("通知設定")).toBeInTheDocument();
    });
  });

  it("チェックボックスとtime inputが表示される", async () => {
    render(
      <Provider>
        <NotificationSettings />
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText("通知を有効にする")).toBeInTheDocument();
    });
    expect(screen.getByText("週間通知時刻:")).toBeInTheDocument();
    expect(screen.getByText("前日通知時刻:")).toBeInTheDocument();
  });

  it("チェックボックスの変更でsaveNotificationSettingsが呼ばれる", async () => {
    const user = userEvent.setup();
    render(
      <Provider>
        <NotificationSettings />
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("checkbox"));

    await waitFor(() => {
      expect(window.electronAPI.saveNotificationSettings).toHaveBeenCalled();
    });
  });
});
