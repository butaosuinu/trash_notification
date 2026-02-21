import { useUpdater } from "../hooks/useUpdater";

const PROGRESS_MAX = 100;

function ErrorBanner({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="glass rounded-lg border-frost-danger/30 p-3 text-sm text-red-400">
      <div className="flex items-center justify-between">
        <span>アップデート確認に失敗しました</span>
        <button
          type="button"
          onClick={onRetry}
          className="rounded bg-red-500/15 px-2 py-1 text-xs text-red-400 hover:bg-red-500/25 transition-colors duration-150"
        >
          再試行
        </button>
      </div>
    </div>
  );
}

function DownloadingBanner({ version, progress }: { version: string | null; progress: number }) {
  const label = version === null ? "" : `v${version} `;
  return (
    <div className="glass rounded-lg p-3 text-sm text-frost-text">
      <p>{label}をダウンロード中...</p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-frost-glass">
        <div
          className="h-full rounded-full bg-frost-accent glow-blue transition-all"
          style={{ width: `${Math.min(progress, PROGRESS_MAX)}%` }}
        />
      </div>
    </div>
  );
}

function ReadyBanner({ version, onInstall }: { version: string | null; onInstall: () => void }) {
  const label = version === null ? "アップデート" : `v${version} `;
  return (
    <div className="glass rounded-lg border-frost-success/30 p-3 text-sm text-emerald-400">
      <div className="flex items-center justify-between">
        <span>{label}の準備完了</span>
        <button
          type="button"
          onClick={onInstall}
          className="rounded bg-frost-success px-3 py-1 text-xs text-white hover:bg-emerald-400 transition-colors duration-150"
        >
          再起動してインストール
        </button>
      </div>
    </div>
  );
}

export function UpdateBanner() {
  const { status, version, progress, installUpdate, checkForUpdates } = useUpdater();

  if (status === "error") {
    return (
      <ErrorBanner
        onRetry={() => {
          void checkForUpdates();
        }}
      />
    );
  }

  if (status === "available" || status === "downloading") {
    return <DownloadingBanner version={version} progress={progress} />;
  }

  if (status === "ready") {
    return (
      <ReadyBanner
        version={version}
        onInstall={() => {
          void installUpdate();
        }}
      />
    );
  }

  return null;
}
