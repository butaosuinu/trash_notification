import { useState, useCallback, useRef, useEffect } from "react";
import { useSetAtom } from "jotai";
import { SAVE_FEEDBACK_DELAY_MS } from "../constants/schedule";
import { toastAtom } from "../stores/toastAtom";

const DEFAULT_TOAST_MESSAGE = "保存しました";

const toastTimerRef: { current: ReturnType<typeof setTimeout> | null } = {
  current: null,
};

type SaveFeedbackResult = {
  readonly saved: boolean;
  readonly showSavedFeedback: (message?: string) => void;
};

export function useSaveFeedback(): SaveFeedbackResult {
  const [saved, setSaved] = useState(false);
  const setToast = useSetAtom(toastAtom);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (savedTimerRef.current !== null) {
        clearTimeout(savedTimerRef.current);
      }
    },
    [],
  );

  const showSavedFeedback = useCallback(
    (message: string = DEFAULT_TOAST_MESSAGE) => {
      if (savedTimerRef.current !== null) {
        clearTimeout(savedTimerRef.current);
      }
      if (toastTimerRef.current !== null) {
        clearTimeout(toastTimerRef.current);
      }

      setSaved(true);
      setToast({ message, visible: true });

      // eslint-disable-next-line functional/immutable-data -- timer state requires mutation
      savedTimerRef.current = setTimeout(() => {
        setSaved(false);
        // eslint-disable-next-line functional/immutable-data -- timer state requires mutation
        savedTimerRef.current = null;
      }, SAVE_FEEDBACK_DELAY_MS);

      // eslint-disable-next-line functional/immutable-data -- timer state requires mutation
      toastTimerRef.current = setTimeout(() => {
        setToast({ message: "", visible: false });
        // eslint-disable-next-line functional/immutable-data -- timer state requires mutation
        toastTimerRef.current = null;
      }, SAVE_FEEDBACK_DELAY_MS);
    },
    [setToast],
  );

  return { saved, showSavedFeedback };
}
