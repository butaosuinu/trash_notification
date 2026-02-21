// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockInitialize, mockScope, mockScopedMethods } = vi.hoisted(() => {
  const scopedMethods = {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  };
  return {
    mockInitialize: vi.fn(),
    mockScope: vi.fn().mockReturnValue(scopedMethods),
    mockScopedMethods: scopedMethods,
  };
});

vi.mock("electron-log/main", () => ({
  default: {
    initialize: mockInitialize,
    scope: mockScope,
  },
}));

describe("logger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initLogger", () => {
    it("electron-logを初期化する", async () => {
      const { initLogger } = await import("../logger");
      initLogger();
      expect(mockInitialize).toHaveBeenCalledOnce();
    });
  });

  describe("createLogger", () => {
    it("指定されたスコープでロガーを作成する", async () => {
      const { createLogger } = await import("../logger");
      const logger = createLogger("test-scope");

      expect(mockScope).toHaveBeenCalledWith("test-scope");
      expect(logger).toHaveProperty("error");
      expect(logger).toHaveProperty("warn");
      expect(logger).toHaveProperty("info");
      expect(logger).toHaveProperty("debug");
    });

    it("スコープ付きメソッドに委譲する", async () => {
      const { createLogger } = await import("../logger");
      const logger = createLogger("test");

      logger.info("test message");
      expect(mockScopedMethods.info).toHaveBeenCalledWith("test message");

      logger.error("error message");
      expect(mockScopedMethods.error).toHaveBeenCalledWith("error message");

      logger.warn("warn message");
      expect(mockScopedMethods.warn).toHaveBeenCalledWith("warn message");

      // eslint-disable-next-line testing-library/no-debugging-utils -- logger.debug, not testing-library debug
      logger.debug("debug message");
      expect(mockScopedMethods.debug).toHaveBeenCalledWith("debug message");
    });
  });
});
