import electronUpdaterModule from "electron-updater";
import type { BrowserWindow } from "electron";
import { app } from "electron";
import { createLogger } from "./logger";

const { autoUpdater } = electronUpdaterModule;
const log = createLogger("updater");

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

const INITIAL_CHECK_DELAY_MS = 5000;
const PERIODIC_CHECK_INTERVAL_MS = 3_600_000;

type RendererNotifier = {
  readonly sendStatus: (payload: UpdateStatusPayload) => void;
  readonly sendProgress: (payload: UpdateProgressPayload) => void;
};

function createRendererNotifier(window: BrowserWindow): RendererNotifier {
  return {
    sendStatus(payload: UpdateStatusPayload): void {
      window.webContents.send("updater:status", payload);
    },
    sendProgress(payload: UpdateProgressPayload): void {
      window.webContents.send("updater:progress", payload);
    },
  };
}

function setupAutoUpdaterEvents(notifier: RendererNotifier): void {
  autoUpdater.on("checking-for-update", () => {
    log.debug("Checking for update");
    notifier.sendStatus({ status: "checking" });
  });

  autoUpdater.on("update-available", (info) => {
    log.info("Update available:", info.version);
    notifier.sendStatus({ status: "available", version: info.version });
  });

  autoUpdater.on("download-progress", (progress) => {
    log.debug("Download progress:", progress.percent);
    notifier.sendStatus({ status: "downloading" });
    notifier.sendProgress({
      percent: progress.percent,
      bytesPerSecond: progress.bytesPerSecond,
      transferred: progress.transferred,
      total: progress.total,
    });
  });

  autoUpdater.on("update-downloaded", (info) => {
    log.info("Update downloaded:", info.version);
    notifier.sendStatus({ status: "ready", version: info.version });
  });

  autoUpdater.on("update-not-available", () => {
    log.debug("No update available");
    notifier.sendStatus({ status: "not-available" });
  });

  autoUpdater.on("error", (error) => {
    log.error("Update error:", error.message);
    notifier.sendStatus({ status: "error", error: error.message });
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
  if (!app.isPackaged) return;

  log.info("Initializing auto-updater");
  const notifier = createRendererNotifier(window);
  setupAutoUpdaterEvents(notifier);

  setTimeout(() => {
    checkForUpdates();
  }, INITIAL_CHECK_DELAY_MS);

  setInterval(() => {
    checkForUpdates();
  }, PERIODIC_CHECK_INTERVAL_MS);
}
