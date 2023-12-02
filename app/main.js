const { app, Menu, Tray, BrowserWindow, ipcMain, dialog } = require('electron');
const windowStateKeeper = require('electron-window-state');
const { readdir } = require('fs/promises');
const path = require('path');
const settings = require('./settings');
const server = require('./server');

const iconPath = path.join(__dirname, 'favicon.ico');

let mainWindow;
let chatWindow;
let mainWindowState;
let chatWindowState;

// GENERATE WIDGET URL FOR FURTHER USAGE AND EXPORT
const getWidgetURL = () => {
  const s = settings.get('app');
  const generalQueryParams = new URLSearchParams(s.widget.general).toString();
  const themeQueryParams = new URLSearchParams(s.widget.themes[s.widget.general['theme']]).toString();
  return `http://localhost:${s.server.port}/?${generalQueryParams}&${themeQueryParams}`;
};

// MAIN WINDOW
const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: 420,
    height: 440,
    icon: iconPath,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.removeMenu();
  //Hide to tray instead of minimizing
  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });
  //Close entire app
  mainWindow.on('closed', function (event) {
    mainWindow = null;
    chatWindow?.close();
    app.quit();
  });
  mainWindow.loadFile('index.html');
  mainWindowState.manage(mainWindow);
}

// CHAT WINDOW
const createChatWindow = () => {
  const gameMode = settings.get('app.widget.gameMode');
  chatWindow = new BrowserWindow({
    x: chatWindowState.x,
    y: chatWindowState.y,
    width: chatWindowState.width,
    height: chatWindowState.height,
    transparent: gameMode,
    frame: !gameMode,
    icon: iconPath,
  });
  chatWindow.removeMenu();
  //This is the best solution but still doesn't work in all cases
  chatWindow.setAlwaysOnTop(gameMode, 'screen-saver');
  chatWindow.setIgnoreMouseEvents(gameMode);
  //Some dark magic to fix Electron window's header bug with frameless window
  if (gameMode) {
    chatWindow.on('blur', () => {
      chatWindow.setBackgroundColor('#00000000');
    });
    chatWindow.on('focus', () => {
      chatWindow.setBackgroundColor('#00000000');
    });
  }
  //Send closed event to the main window when the window is actually closed
  chatWindow.on('closed', function () {
    chatWindow = null;
    mainWindow?.webContents.send('chat-window-closed');
  });
  chatWindow.loadURL(getWidgetURL());
  chatWindowState.manage(chatWindow);
  //Send opened event to the main window
  mainWindow.webContents.send('chat-window-opened');
}

const setHandlers = () => {

  process.on('uncaughtException', (error) => {
    if (error.code == 'EADDRINUSE'){
      /* Do something to let the user know that port is already in use */
    }
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
  });

  ipcMain.on('chat-window-open', () => createChatWindow());

  ipcMain.on('chat-window-close', () => chatWindow.destroy());

  ipcMain.handle('get-widget-url', () => getWidgetURL());

  ipcMain.handle('get-themes', () => {
    return (async (source) => (await readdir(source, { withFileTypes: true }))
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name))(`${__dirname}/../widget/themes/`);
  });

  ipcMain.handle('theme-load', (_, theme) => {
    try {
      const themeConfig = require(`${__dirname}/../widget/themes/${theme}/ziegmachat.config.json`);
      let s = settings.get(`app.widget.themes.${theme}`);
      if (!s) {
        const themeDefaults = {};
        themeConfig.fields?.forEach(field => {
          themeDefaults[field.name] = field.value.default;
        });
        s = themeDefaults;
        settings.set(`app.widget.themes.${theme}`, s);
      }
      return { config: themeConfig, settings: s };
    }
    catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        // Return something not undefined just in case
        return false;
      }
    }
  });

  ipcMain.handle('settings-get', () => settings.get('app'));

  ipcMain.on('settings-set', (_, changedSettings) => {
    const theme = Object.keys(changedSettings.widget.themes)[0];
    const serverSettings = settings.get('app.server');
    settings.set('app.server', { ...serverSettings, ...changedSettings.server });
    const widgetGeneralSettings = settings.get('app.widget.general');
    settings.set('app.widget.general', { ...widgetGeneralSettings, ...changedSettings.widget.general });
    const widgetThemeSettings = settings.get(`app.widget.themes.${theme}`);
    settings.set(`app.widget.themes.${theme}`, { ...widgetThemeSettings, ...changedSettings.widget.themes[theme] });
    if (changedSettings.server.port) {
      server.close();
      server.listen(changedSettings.server.port);
    }
    if (Object.keys(changedSettings.widget.general).length > 0 || Object.keys(changedSettings.widget.themes[theme]).length > 0) {
      chatWindow?.loadURL(getWidgetURL());
    }
  });

  ipcMain.handle('settings-reset', async () => {
    let response = false;
    await dialog.showMessageBox(mainWindow, {
      type: 'question',
      buttons: ['&Yes', '&Cancel'],
      defaultId: 1,
      title: 'ZiegmaChat',
      message: 'Are you sure you want to reset to defaults?',
      icon: iconPath,
      cancelId: 1,
      normalizeAccessKeys: true
    }).then(promise => {
      if (promise.response === 0) {
        settings.set('app', settings.get('defaults'));
        server.close();
        server.listen(settings.get('app.server.port'));
        if (chatWindow) {
          chatWindow.destroy();
          createChatWindow();
        }
        response = true;
      }
    });
    return response;
  });

  ipcMain.handle('toggle-game-mode', () => {
    chatWindow?.destroy();
    const gameMode = !settings.get('app.widget.gameMode');
    settings.set('app.widget.gameMode', gameMode);
    createChatWindow();
    return gameMode;
  });
}

// ELECTRON MAIN
app.whenReady().then(() => {
  //Create state files to save windows' size and position on reload
  mainWindowState = windowStateKeeper({
    file: 'main.json',
  });
  chatWindowState = windowStateKeeper({
    file: 'chat.json',
    defaultWidth: 800,
    defaultHeight: 600,
  });

  createMainWindow();
  setHandlers();

  // Create tray and its context menu
  const tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'ZiegmaChat for Streamer.bot',
      enabled: false,
    },
    {
      type: 'separator',
    },
    {
      label: 'Show', click: function () {
        mainWindow.show();
      }
    },
    {
      label: 'Quit', click: function () {
        chatWindow?.destroy();
        mainWindow.destroy();
        app.quit();
      }
    }
  ]);
  tray.setToolTip('ZiegmaChat');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    mainWindow.show();
  });

  // Start internal HTTP server
  server.listen(settings.get('app.server.port'));
});