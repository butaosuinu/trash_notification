# ゴミの日通知

ゴミ出しに役立つ、ダメ人間のダメ人間によるダメ人間のためのデスクトップアプリ。

## 主な機能

- 今日のゴミ収集情報をダッシュボードで表示
- 週間スケジュール表示（日〜土）
- 月間カレンダー表示（月ごとのゴミ収集スケジュール）
- 通知設定（ゴミ出しリマインダー通知）
- トレイ常駐（ウィンドウを閉じてもバックグラウンドで動作）
- 自動アップデート機能
- Google Gemini API による PDF スケジュール自動解析・取り込み
- 4 種類のスケジュールルール対応（毎週 / 隔週 / 第 N 週 / 特定日）
- 12 種類のゴミカテゴリアイコン（燃えるゴミ、不燃ゴミ、資源、プラ、ビン、缶、紙、布、粗大、有害、電池、その他）

## 技術スタック

- **Electron 35** + **React 19** + **TypeScript 5.8** + **Vite 6**
- [electron-vite](https://electron-vite.org/) — 3 プロセスビルド（Main / Preload / Renderer）
- [Jotai](https://jotai.org/) — 状態管理
- [Tailwind CSS 4](https://tailwindcss.com/) — スタイリング
- [@google/genai](https://www.npmjs.com/package/@google/genai) — Gemini API による PDF 解析
- [electron-store](https://github.com/sindresorhus/electron-store) — データ永続化
- [electron-updater](https://www.electron.build/auto-update) — 自動アップデート
- [date-fns](https://date-fns.org/) — 日付処理

## 必要環境

- Node.js 20+
- pnpm

## セットアップ

```bash
git clone https://github.com/butaosuinu/trash-notification.git
cd trash-notification
pnpm install
pnpm run dev
```

### Gemini API キーの設定

PDF スケジュール解析機能を使うには Google Gemini API キーが必要です。
アプリの設定画面から API キーを入力してください。

## 開発コマンド

| コマンド | 説明 |
|---|---|
| `pnpm run dev` | 開発サーバー起動（ホットリロード） |
| `pnpm run build` | プロダクションビルド |
| `pnpm run check` | format:check + lint + test:run（CI 相当） |
| `pnpm run lint` | oxlint + eslint |
| `pnpm run lint:fix` | oxlint + eslint（自動修正） |
| `pnpm run format` | oxfmt（TS/TSX）+ prettier（CSS） |
| `pnpm run typecheck` | tsc --noEmit |
| `pnpm run test` | vitest（watch モード） |
| `pnpm run test:run` | vitest（単発実行） |
| `pnpm run test:coverage` | vitest + カバレッジ |

## プロジェクト構成

```
src/
├── main/               # Main プロセス
│   ├── index.ts        #   アプリ起動、ウィンドウ・トレイ作成
│   ├── ipc/            #   IPC ハンドラー（スケジュール、Gemini、通知、アップデート）
│   └── services/       #   electron-store、Gemini、通知、アップデートサービス
├── preload/            # Preload（contextBridge で IPC を安全に公開）
│   └── index.ts
├── shared/             # プロセス間共有コード（型定義、定数、ユーティリティ）
└── renderer/           # Renderer（React UI）
    └── src/
        ├── components/ #   Dashboard / Calendar / Settings / 共通コンポーネント
        ├── hooks/      #   useSchedule, useDateTime, useGeminiImport, useNotificationSettings 等
        ├── stores/     #   Jotai atoms
        ├── types/      #   型定義
        ├── constants/  #   定数
        └── utils/      #   日付ユーティリティ、スケジュールマッチング
```

## テスト

- **Vitest** + **happy-dom** + **@testing-library/react**
- テストファイル: `src/**/*.test.{ts,tsx}` または `src/**/__tests__/**`

```bash
pnpm run test:run
```

## CI

GitHub Actions で `master` ブランチへの push / PR 時に以下の 4 ジョブを並列実行:

1. **lint** — フォーマットチェック + リント
2. **typecheck** — 型チェック
3. **test** — テスト実行
4. **build** — ビルド

## License

[MIT](https://opensource.org/licenses/MIT)

## Author

[butaosuinu](https://github.com/butaosuinu)
