import { vi } from "vitest";

export const initLogger = vi.fn();

export const createLogger = vi.fn().mockReturnValue({
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
});
