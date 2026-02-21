import { useState } from "react";
import { Provider } from "jotai";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Settings } from "./components/settings/Settings";
import { UpdateBanner } from "./components/UpdateBanner";

type ViewMode = "dashboard" | "settings";

export function App() {
  const [view, setView] = useState<ViewMode>("dashboard");

  return (
    <Provider>
      <UpdateBanner />
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
