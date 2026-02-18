import { useState, useCallback } from "react";
import type { TrashSchedule } from "../types/schedule";

type ImportState = {
  filePath: string | null;
  extractedSchedule: TrashSchedule | null;
  isLoading: boolean;
  error: string | null;
};

export function useGeminiImport() {
  const [state, setState] = useState<ImportState>({
    filePath: null,
    extractedSchedule: null,
    isLoading: false,
    error: null,
  });

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
      setState((prev) => ({
        ...prev,
        extractedSchedule: schedule,
        isLoading: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "PDF解析に失敗しました";
      setState((prev) => ({
        ...prev,
        error: message,
        isLoading: false,
      }));
    }
  }, [state.filePath]);

  const reset = useCallback(() => {
    setState({
      filePath: null,
      extractedSchedule: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    selectFile,
    extractSchedule,
    reset,
  };
}
