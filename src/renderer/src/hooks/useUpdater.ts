import { useAtom } from "jotai";
import { useEffect, useCallback } from "react";
import { updateStateAtom } from "../stores/updaterAtom";

export function useUpdater() {
  const [updateState, setUpdateState] = useAtom(updateStateAtom);

  useEffect(() => {
    const cleanupStatus = window.electronAPI.onUpdateStatus((payload) => {
      setUpdateState((prev) => ({
        ...prev,
        status: payload.status,
        version: payload.version ?? prev.version,
        error: payload.error ?? null,
      }));
    });

    const cleanupProgress = window.electronAPI.onUpdateProgress((payload) => {
      setUpdateState((prev) => ({
        ...prev,
        progress: payload.percent,
      }));
    });

    return () => {
      cleanupStatus();
      cleanupProgress();
    };
  }, [setUpdateState]);

  const checkForUpdates = useCallback(async () => {
    await window.electronAPI.checkForUpdates();
  }, []);

  const installUpdate = useCallback(async () => {
    await window.electronAPI.installUpdate();
  }, []);

  return {
    ...updateState,
    checkForUpdates,
    installUpdate,
  };
}
