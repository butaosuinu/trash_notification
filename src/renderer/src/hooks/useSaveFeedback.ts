import { useState, useCallback } from "react";
import { SAVE_FEEDBACK_DELAY_MS } from "../constants/schedule";

type SaveFeedbackResult = {
  readonly saved: boolean;
  readonly showSavedFeedback: () => void;
};

export function useSaveFeedback(): SaveFeedbackResult {
  const [saved, setSaved] = useState(false);

  const showSavedFeedback = useCallback(() => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, SAVE_FEEDBACK_DELAY_MS);
  }, []);

  return { saved, showSavedFeedback };
}
