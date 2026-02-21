import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider, createStore } from "jotai";
import { UpdateBanner } from "../UpdateBanner";
import { updateStateAtom } from "../../stores/updaterAtom";

function renderWithStore(store: ReturnType<typeof createStore>) {
  return render(
    <Provider store={store}>
      <UpdateBanner />
    </Provider>,
  );
}

describe("UpdateBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("idleステータスでは何も表示しない", () => {
    const store = createStore();
    renderWithStore(store);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByText(/ダウンロード中/)).toBeNull();
  });

  it("checkingステータスでは何も表示しない", () => {
    const store = createStore();
    store.set(updateStateAtom, {
      status: "checking",
      version: null,
      error: null,
      progress: 0,
    });
    renderWithStore(store);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("not-availableステータスでは何も表示しない", () => {
    const store = createStore();
    store.set(updateStateAtom, {
      status: "not-available",
      version: null,
      error: null,
      progress: 0,
    });
    renderWithStore(store);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("downloadingステータスでプログレスバーを表示する", () => {
    const store = createStore();
    store.set(updateStateAtom, {
      status: "downloading",
      version: "1.1.0",
      error: null,
      progress: 50,
    });
    renderWithStore(store);
    expect(screen.getByText(/ダウンロード中/)).toBeInTheDocument();
  });

  it("readyステータスでインストールボタンを表示する", () => {
    const store = createStore();
    store.set(updateStateAtom, {
      status: "ready",
      version: "1.1.0",
      error: null,
      progress: 0,
    });
    renderWithStore(store);
    expect(screen.getByRole("button", { name: "再起動してインストール" })).toBeInTheDocument();
    expect(screen.getByText(/v1\.1\.0/)).toBeInTheDocument();
  });

  it("errorステータスで再試行ボタンを表示する", () => {
    const store = createStore();
    store.set(updateStateAtom, {
      status: "error",
      version: null,
      error: "Network error",
      progress: 0,
    });
    renderWithStore(store);
    expect(screen.getByText("アップデート確認に失敗しました")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "再試行" })).toBeInTheDocument();
  });

  it("インストールボタンをクリックするとinstallUpdateが呼ばれる", async () => {
    const user = userEvent.setup();
    const store = createStore();
    store.set(updateStateAtom, {
      status: "ready",
      version: "1.1.0",
      error: null,
      progress: 0,
    });
    renderWithStore(store);

    await user.click(screen.getByRole("button", { name: "再起動してインストール" }));
    expect(window.electronAPI.installUpdate).toHaveBeenCalledOnce();
  });

  it("再試行ボタンをクリックするとcheckForUpdatesが呼ばれる", async () => {
    const user = userEvent.setup();
    const store = createStore();
    store.set(updateStateAtom, {
      status: "error",
      version: null,
      error: "Network error",
      progress: 0,
    });
    renderWithStore(store);

    await user.click(screen.getByRole("button", { name: "再試行" }));
    expect(window.electronAPI.checkForUpdates).toHaveBeenCalledOnce();
  });
});
