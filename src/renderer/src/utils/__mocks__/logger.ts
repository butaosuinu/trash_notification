import { vi } from "vitest";

export const createLogger = vi.fn().mockReturnValue({
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
});
