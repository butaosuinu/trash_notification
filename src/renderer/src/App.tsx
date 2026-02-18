import { useState } from "react";
import { Provider } from "jotai";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Settings } from "./components/settings/Settings";

type ViewMode = "dashboard" | "settings";

export function App() {
  const [view, setView] = useState<ViewMode>("dashboard");

  return (
    <Provider>
      {view === "dashboard" ? (
        <Dashboard
          onOpenSettings={() => {
            setView("settings");
          }}
        />
      ) : (
        <Settings
          onBack={() => {
            setView("dashboard");
          }}
        />
      )}
    </Provider>
  );
}
