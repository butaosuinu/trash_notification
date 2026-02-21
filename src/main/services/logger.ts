import log from "electron-log/main.js";

export function initLogger(): void {
  log.initialize();
}

export function createLogger(scope: string) {
  const scoped = log.scope(scope);
  return {
    error: scoped.error.bind(scoped),
    warn: scoped.warn.bind(scoped),
    info: scoped.info.bind(scoped),
    debug: scoped.debug.bind(scoped),
  } as const;
}
