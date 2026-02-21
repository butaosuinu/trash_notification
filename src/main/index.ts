import { app, BrowserWindow, Tray, Menu, nativeImage } from "electron";
import { join } from "node:path";
import { registerScheduleHandlers } from "./ipc/scheduleHandlers";
import { registerGeminiHandlers } from "./ipc/geminiHandlers";
import { registerUpdaterHandlers } from "./ipc/updaterHandlers";
import { initUpdater } from "./services/updaterService";

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const WINDOW_WIDTH = 500;
const WINDOW_HEIGHT = 400;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (process.env.ELECTRON_RENDERER_URL === undefined) {
    void mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  } else {
    void mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  }

  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow?.hide();
  });
}

function createTray(): void {
  const iconPath = join(__dirname, "../../resources/icon.png");
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "表示",
      click: () => {
        mainWindow?.show();
      },
    },
    { type: "separator" },
    {
      label: "終了",
      accelerator: "Command+Q",
      click: () => {
        mainWindow?.destroy();
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip("ゴミ通知");
}

void app.whenReady().then(() => {
  registerScheduleHandlers();
  registerGeminiHandlers();
  registerUpdaterHandlers();

  createWindow();
  createTray();

  if (mainWindow !== null) {
    initUpdater(mainWindow);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
