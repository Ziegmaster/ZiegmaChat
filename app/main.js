// Modules to control application life and create native browser window
const { app, Menu, Tray, BrowserWindow, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const settings = require('./settings');
const server = require('./server');

server.listen(settings.get('app.server.port'));

const iconPath = path.join(__dirname, 'favicon.ico');

let tray = null;
let mainWindow;
let chatWindow;
let mainWindowState;
let chatWindowState;

const getChatURL = () => {
  let s = settings.get('app');
  let url = 'http://localhost:';
  url += `${s.server.port}`;
  url += `/?ws-port=${s.chat.port}`;
  url += `&debug=${s.chat.debug}`;
  return url;
};

const createWindow = (type) => {
  mainWindow = new BrowserWindow({
    x : mainWindowState.x,
    y : mainWindowState.y,
    width : 420,
    height : 440,
    icon : iconPath,
    resizable : false,
    webPreferences : {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.removeMenu();
  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });
  mainWindow.on('closed', function (event) {
    try{
      chatWindow.destroy();
    }
    catch{}
    app.quit();
  })
  mainWindow.loadFile('index.html');
  mainWindowState.manage(mainWindow);
}

const createChatWindow = () => {
  let chat_settings = settings.get('app.chat');
  chatWindow?.destroy();
  chatWindow = new BrowserWindow({
    x : chatWindowState.x,
    y : chatWindowState.y,
    width : chatWindowState.width,
    height : chatWindowState.height,
    transparent : chat_settings.game_mode,
    frame : !chat_settings.game_mode,
    icon : iconPath,
  });
  chatWindow.removeMenu();
  chatWindow.setAlwaysOnTop(chat_settings.game_mode, 'screen-saver');
  chatWindow.setIgnoreMouseEvents(chat_settings.game_mode);
  if (chat_settings.game_mode){
    chatWindow.on('blur', () => {
      try{
        chatWindow.setBackgroundColor('#00000000');
      }
      catch{}
    });
    chatWindow.on('focus', () => {
      try{
        chatWindow.setBackgroundColor('#00000000');
      }
      catch{}
    });
  }
  chatWindow.on('closed', function () {
    try{
      mainWindow.webContents.send('chat-closed');
    }
    catch{}
    chatWindow = null;
  });
  chatWindow.loadURL(getChatURL());
  chatWindowState.manage(chatWindow);
  mainWindow.webContents.send('chat-opened');
}

//ipc
ipcMain.on('chat-open', createChatWindow);

ipcMain.on('chat-close', () => {
  chatWindow?.destroy();
});

ipcMain.on('copy', (event, data) => {
  event.reply('copy', getChatURL());
});

ipcMain.on('settings-get', (event, data) => {
  event.reply('settings-get', settings.get('app'));
});

ipcMain.on('settings-set', (event, data) => {
  console.log(data);
  let server_settings = settings.get('app.server');
  settings.set('app.server', {...server_settings, ...data.server});
  let chat_settings = settings.get('app.chat');
  settings.set('app.chat', {...chat_settings, ...data.chat});
  if (data.server.port){
    server.close();
    server.listen(data.server.port);
  }
  if (chatWindow && Object.keys(data.chat).length > 0){
    createChatWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

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
        chatWindow?.destroy();
        mainWindow.destroy();
        app.quit();
      }
    }
  ]);

  tray.setToolTip('ZiegmaChat');
  tray.setContextMenu(contextMenu);

  mainWindowState = windowStateKeeper({
    file : 'main.json',
  });
  
  chatWindowState = windowStateKeeper({
    file : 'chat.json',
    defaultWidth : 800,
    defaultHeight : 600,
  });

  createWindow();

  tray.on('click', () => {
    mainWindow.show();
  });

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
