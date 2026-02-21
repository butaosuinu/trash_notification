import { atom } from "jotai";
import type { NotificationSettings } from "../../../shared/types/notification";

export const notificationSettingsAtom = atom<NotificationSettings>({
  enabled: true,
  weeklyNotificationTime: "07:00",
  dayBeforeNotificationTime: "20:00",
});
