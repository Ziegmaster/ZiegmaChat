const { app, Menu, Tray, BrowserWindow, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const settings = require('./settings');
const server = require('./server');

//START INTERNAL HTTP SERVER
server.listen(settings.get('app.server.port'));

const iconPath = path.join(__dirname, 'favicon.ico');

let tray = null;
let mainWindow;
let chatWindow;
let mainWindowState;
let chatWindowState;

//GENERATE WIDGET URL FOR FURTHER USAGE AND EXPORT
const getChatURL = () => {
  let s = settings.get('app');
  let url = 'http://localhost:';
  url += `${s.server.port}`;
  url += `/?ws-port=${s.chat.port}`;
  url += `&debug=${s.chat.debug}`;
  return url;
};

//MAIN WINDOW
const createMainWindow = (type) => {
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

//CHAT WINDOW
const createChatWindow = () => {
  //This is not a window's settings but the widget one's
  let chat_settings = settings.get('app.chat');
  chatWindow = new BrowserWindow({
    x: chatWindowState.x,
    y: chatWindowState.y,
    width: chatWindowState.width,
    height: chatWindowState.height,
    transparent: chat_settings.game_mode,
    frame: !chat_settings.game_mode,
    icon: iconPath,
  });
  chatWindow.removeMenu();
  chatWindow.setAlwaysOnTop(chat_settings.game_mode, 'screen-saver');
  chatWindow.setIgnoreMouseEvents(chat_settings.game_mode);
  //Some dark magic to fix Electron window's header bug with frameless window
  if (chat_settings.game_mode) {
    chatWindow.on('blur', () => {
      chatWindow.setBackgroundColor('#00000000');
    });
    chatWindow.on('focus', () => {
      chatWindow.setBackgroundColor('#00000000');
    });
  }
  //Send "closed" event to the main window when the window is actually closed
  chatWindow.on('closed', function () {
    chatWindow = null;
    mainWindow?.webContents.send('chat-closed');
  });
  chatWindow.loadURL(getChatURL());
  chatWindowState.manage(chatWindow);
  //Send "opened" event to the main window
  mainWindow.webContents.send('chat-opened');
}

//IPC SECTION

//Create chat window when receive command
ipcMain.on('chat-open', createChatWindow);

//Close chat window when receive command
ipcMain.on('chat-close', () => {
  chatWindow.destroy();
});

//Copy chat URL to clipboard when receive command
ipcMain.on('copy', (event, data) => {
  event.reply('copy', getChatURL());
});

//Get stored app settings when receive command
ipcMain.on('settings-get', (event, data) => {
  event.reply('settings-get', settings.get('app'));
});

//Update stored app settings when receive command
ipcMain.on('settings-set', (event, data) => {
  let server_settings = settings.get('app.server');
  settings.set('app.server', { ...server_settings, ...data.server });
  let chat_settings = settings.get('app.chat');
  settings.set('app.chat', { ...chat_settings, ...data.chat });
  if (data.server.port) {
    server.close();
    server.listen(data.server.port);
  }
  if (chatWindow && Object.keys(data.chat).length > 0) {
    chatWindow.destroy();
    createChatWindow();
  }
});

//ELECTRON MAIN
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

  //Create tray and its context menu
  tray = new Tray(iconPath);
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
        chatWindow.destroy();
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

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  })
});

//APP CLOSURE
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
