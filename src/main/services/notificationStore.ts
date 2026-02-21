import Store from "electron-store";
import { createLogger } from "./logger";
import type { NotificationSettings } from "../../shared/types/notification";

export type { NotificationSettings } from "../../shared/types/notification";

const log = createLogger("notificationStore");

const DEFAULT_WEEKLY_TIME = "07:00";
const DEFAULT_DAY_BEFORE_TIME = "20:00";

type NotificationStoreSchema = {
  notification: NotificationSettings;
};

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  weeklyNotificationTime: DEFAULT_WEEKLY_TIME,
  dayBeforeNotificationTime: DEFAULT_DAY_BEFORE_TIME,
};

const store = new Store<NotificationStoreSchema>({
  name: "notification-settings",
  defaults: {
    notification: DEFAULT_SETTINGS,
  },
});

export function loadNotificationSettings(): NotificationSettings {
  log.debug("Loading notification settings");
  return store.get("notification");
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  log.debug("Saving notification settings");
  store.set("notification", settings);
}
