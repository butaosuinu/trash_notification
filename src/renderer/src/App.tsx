import { useState } from "react";
import { Provider } from "jotai";
import { MonthlyCalendar } from "./components/calendar/MonthlyCalendar";
import { Toast } from "./components/common/Toast";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Settings } from "./components/settings/Settings";
import { UpdateBanner } from "./components/UpdateBanner";

type ViewMode = "dashboard" | "settings" | "calendar";

export function App() {
  const [view, setView] = useState<ViewMode>("dashboard");

  const goToDashboard = () => {
    setView("dashboard");
  };

  return (
    <Provider>
      <Toast />
      <UpdateBanner />
      {view === "dashboard" ? (
        <Dashboard
          onOpenCalendar={() => {
            setView("calendar");
          }}
          onOpenSettings={() => {
            setView("settings");
          }}
        />
      ) : view === "calendar" ? (
        <MonthlyCalendar onBack={goToDashboard} />
      ) : (
        <Settings onBack={goToDashboard} />
      )}
    </Provider>
  );
}
