import { useAtom } from "jotai";
import { useEffect, useCallback } from "react";
import { scheduleAtom } from "../stores/scheduleAtom";
import type { TrashSchedule } from "../types/schedule";

export function useSchedule() {
  const [schedule, setSchedule] = useAtom(scheduleAtom);

  useEffect(() => {
    void window.electronAPI.getSchedule().then(setSchedule);
  }, [setSchedule]);

  const saveSchedule = useCallback(
    async (newSchedule: TrashSchedule) => {
      await window.electronAPI.saveSchedule(newSchedule);
      setSchedule(newSchedule);
    },
    [setSchedule],
  );

  return { schedule, saveSchedule };
}
