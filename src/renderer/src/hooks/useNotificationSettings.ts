import { useAtom } from "jotai";
import { useEffect, useCallback } from "react";
import { notificationSettingsAtom } from "../stores/notificationAtom";
import type { NotificationSettings } from "../../../shared/types/notification";

export function useNotificationSettings() {
  const [settings, setSettings] = useAtom(notificationSettingsAtom);

  useEffect(() => {
    void window.electronAPI.getNotificationSettings().then(setSettings);
  }, [setSettings]);

  const saveSettings = useCallback(
    async (newSettings: NotificationSettings) => {
      await window.electronAPI.saveNotificationSettings(newSettings);
      setSettings(newSettings);
    },
    [setSettings],
  );

  return { settings, saveSettings };
}
