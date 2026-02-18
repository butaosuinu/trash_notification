import { useState, useEffect } from "react";
import { SAVE_FEEDBACK_DELAY_MS } from "../../constants/schedule";

export function ApiKeyInput() {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void window.electronAPI.getApiKey().then((key) => {
      if (key !== null) {
        setApiKey(key);
      }
    });
  }, []);

  const handleSave = async () => {
    await window.electronAPI.setApiKey(apiKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, SAVE_FEEDBACK_DELAY_MS);
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h3 className="mb-2 text-sm font-medium text-gray-500">Gemini API キー</h3>
      <div className="flex gap-2">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
          }}
          placeholder="API キーを入力"
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => {
            void handleSave();
          }}
          className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
        >
          {saved ? "保存済み" : "保存"}
        </button>
      </div>
    </div>
  );
}
