import { useState, useEffect } from "react";
import { CLOCK_INTERVAL_MS } from "../constants/schedule";

export function useDateTime(intervalMs = CLOCK_INTERVAL_MS): Date {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, intervalMs);
    return () => {
      clearInterval(timer);
    };
  }, [intervalMs]);

  return now;
}
