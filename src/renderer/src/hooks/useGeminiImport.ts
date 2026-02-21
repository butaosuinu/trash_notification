import { useState, useCallback } from "react";
import type { TrashSchedule } from "../types/schedule";
import { createLogger } from "@/utils/logger";

const log = createLogger("geminiImport");

type ImportState = {
  filePath: string | null;
  extractedSchedule: TrashSchedule | null;
  isLoading: boolean;
  error: string | null;
};

const INITIAL_STATE: ImportState = {
  filePath: null,
  extractedSchedule: null,
  isLoading: false,
  error: null,
};

export function useGeminiImport() {
  const [state, setState] = useState<ImportState>(INITIAL_STATE);

  const selectFile = useCallback(async () => {
    const path = await window.electronAPI.selectPdfFile();
    setState((prev) => ({
      ...prev,
      filePath: path,
      extractedSchedule: null,
      error: null,
    }));
  }, []);

  const extractSchedule = useCallback(async () => {
    if (state.filePath === null) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const schedule = await window.electronAPI.parsePdfWithGemini(state.filePath);
      log.info("PDF parsed successfully");
      setState((prev) => ({
        ...prev,
        extractedSchedule: schedule,
        isLoading: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "PDF解析に失敗しました";
      log.error("PDF parse failed:", message);
      setState((prev) => ({
        ...prev,
        error: message,
        isLoading: false,
      }));
    }
  }, [state.filePath]);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    ...state,
    selectFile,
    extractSchedule,
    reset,
  };
}
