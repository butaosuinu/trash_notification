import { ipcMain } from "electron";
import { checkForUpdates, installUpdate } from "../services/updaterService";
import { createLogger } from "../services/logger";

const log = createLogger("updaterHandlers");

export function registerUpdaterHandlers(): void {
  ipcMain.handle("updater:check", () => {
    log.debug("updater:check");
    checkForUpdates();
  });

  ipcMain.handle("updater:install", () => {
    log.debug("updater:install");
    installUpdate();
  });
}
