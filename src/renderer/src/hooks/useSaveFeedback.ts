import { useState, useCallback } from "react";
import { useSetAtom } from "jotai";
import { SAVE_FEEDBACK_DELAY_MS } from "../constants/schedule";
import { toastAtom } from "../stores/toastAtom";

const DEFAULT_TOAST_MESSAGE = "保存しました";

type SaveFeedbackResult = {
  readonly saved: boolean;
  readonly showSavedFeedback: (message?: string) => void;
};

export function useSaveFeedback(): SaveFeedbackResult {
  const [saved, setSaved] = useState(false);
  const setToast = useSetAtom(toastAtom);

  const showSavedFeedback = useCallback(
    (message: string = DEFAULT_TOAST_MESSAGE) => {
      setSaved(true);
      setToast({ message, visible: true });
      setTimeout(() => {
        setSaved(false);
        setToast({ message: "", visible: false });
      }, SAVE_FEEDBACK_DELAY_MS);
    },
    [setToast],
  );

  return { saved, showSavedFeedback };
}
