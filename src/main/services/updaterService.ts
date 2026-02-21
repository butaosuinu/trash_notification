import electronUpdaterModule from "electron-updater";
import type { BrowserWindow } from "electron";
import { app } from "electron";

const { autoUpdater } = electronUpdaterModule;

type UpdateStatus =
  | "idle"
  | "checking"
  | "available"
  | "not-available"
  | "downloading"
  | "ready"
  | "error";

type UpdateStatusPayload = {
  status: UpdateStatus;
  version?: string;
  error?: string;
};

type UpdateProgressPayload = {
  percent: number;
  bytesPerSecond: number;
  transferred: number;
  total: number;
};

let win: BrowserWindow | null = null;

const INITIAL_CHECK_DELAY_MS = 5000;
const PERIODIC_CHECK_INTERVAL_MS = 3_600_000;

function sendStatusToRenderer(payload: UpdateStatusPayload): void {
  win?.webContents.send("updater:status", payload);
}

function sendProgressToRenderer(payload: UpdateProgressPayload): void {
  win?.webContents.send("updater:progress", payload);
}

function setupAutoUpdaterEvents(): void {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("checking-for-update", () => {
    sendStatusToRenderer({ status: "checking" });
  });

  autoUpdater.on("update-available", (info) => {
    sendStatusToRenderer({ status: "available", version: info.version });
  });

  autoUpdater.on("download-progress", (progress) => {
    sendStatusToRenderer({ status: "downloading" });
    sendProgressToRenderer({
      percent: progress.percent,
      bytesPerSecond: progress.bytesPerSecond,
      transferred: progress.transferred,
      total: progress.total,
    });
  });

  autoUpdater.on("update-downloaded", (info) => {
    sendStatusToRenderer({ status: "ready", version: info.version });
  });

  autoUpdater.on("update-not-available", () => {
    sendStatusToRenderer({ status: "not-available" });
  });

  autoUpdater.on("error", (error) => {
    sendStatusToRenderer({ status: "error", error: error.message });
  });
}

export function checkForUpdates(): void {
  if (!app.isPackaged) return;
  void autoUpdater.checkForUpdates();
}

export function installUpdate(): void {
  autoUpdater.quitAndInstall();
}

export function initUpdater(window: BrowserWindow): void {
  if (!app.isPackaged) {
    // eslint-disable-next-line no-console -- dev mode diagnostic
    console.log("Updater: skipping in dev mode");
    return;
  }

  win = window;
  setupAutoUpdaterEvents();

  setTimeout(() => {
    checkForUpdates();
  }, INITIAL_CHECK_DELAY_MS);

  setInterval(() => {
    checkForUpdates();
  }, PERIODIC_CHECK_INTERVAL_MS);
}
