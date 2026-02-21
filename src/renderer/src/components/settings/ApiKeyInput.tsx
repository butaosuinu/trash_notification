import { useState, useEffect } from "react";
import { useSaveFeedback } from "../../hooks/useSaveFeedback";
import { Button } from "../common/Button";
import { Card } from "../common/Card";

export function ApiKeyInput() {
  const [apiKey, setApiKey] = useState("");
  const { saved, showSavedFeedback } = useSaveFeedback();

  useEffect(() => {
    void window.electronAPI.getApiKey().then((key) => {
      if (key !== null) {
        setApiKey(key);
      }
    });
  }, []);

  const handleSave = async () => {
    await window.electronAPI.setApiKey(apiKey);
    showSavedFeedback();
  };

  return (
    <Card title="Gemini API キー">
      <div className="flex gap-2">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
          }}
          placeholder="API キーを入力"
          className="flex-1 rounded border border-frost-input-border bg-frost-input-bg px-3 py-2 text-sm text-frost-text placeholder:text-frost-text-muted focus:border-frost-accent focus:outline-none transition-all duration-150"
        />
        <Button
          onClick={() => {
            void handleSave();
          }}
        >
          {saved ? "保存済み" : "保存"}
        </Button>
      </div>
    </Card>
  );
}
