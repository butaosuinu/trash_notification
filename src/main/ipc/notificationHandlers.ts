import { ipcMain } from "electron";
import {
  loadNotificationSettings,
  saveNotificationSettings,
  type NotificationSettings,
} from "../services/notificationStore";
import { rescheduleNotifications } from "../services/notificationService";
import { createLogger } from "../services/logger";

const log = createLogger("notificationHandlers");

export function registerNotificationHandlers(): void {
  ipcMain.handle("notification:getSettings", () => {
    log.debug("notification:getSettings");
    return loadNotificationSettings();
  });

  ipcMain.handle("notification:saveSettings", (_event, settings: unknown) => {
    log.debug("notification:saveSettings");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- settings comes from trusted IPC
    saveNotificationSettings(settings as NotificationSettings);
    rescheduleNotifications();
  });
}
