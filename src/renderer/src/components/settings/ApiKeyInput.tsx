import { useState, useEffect, useRef } from "react";
import { AUTOSAVE_DELAY_MS } from "../../constants/schedule";
import { useSaveFeedback } from "../../hooks/useSaveFeedback";
import { Card } from "../common/Card";

export function ApiKeyInput() {
  const [apiKey, setApiKey] = useState("");
  const lastSavedKey = useRef<string>("");
  const { showSavedFeedback } = useSaveFeedback();

  useEffect(() => {
    void window.electronAPI.getApiKey().then((key) => {
      const resolved = key ?? "";
      // eslint-disable-next-line functional/immutable-data -- ref state requires mutation
      lastSavedKey.current = resolved;
      setApiKey(resolved);
    });
  }, []);

  useEffect(() => {
    if (apiKey === lastSavedKey.current) return;

    const timer = setTimeout(() => {
      void window.electronAPI.setApiKey(apiKey).then(() => {
        // eslint-disable-next-line functional/immutable-data -- ref state requires mutation
        lastSavedKey.current = apiKey;
        showSavedFeedback();
      });
    }, AUTOSAVE_DELAY_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [apiKey, showSavedFeedback]);

  return (
    <Card title="Gemini API キー">
      <input
        type="password"
        value={apiKey}
        onChange={(e) => {
          setApiKey(e.target.value);
        }}
        placeholder="API キーを入力"
        className="w-full rounded border border-frost-input-border bg-frost-input-bg px-3 py-2 text-sm text-frost-text placeholder:text-frost-text-muted focus:border-frost-accent focus:outline-none transition-all duration-150"
      />
    </Card>
  );
}
