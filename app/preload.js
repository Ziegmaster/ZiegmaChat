const { contextBridge, ipcRenderer } = require('electron');

// White-listed channels.
const $ipc = {
  // From main to render
  listen: [
    'chat-window-opened',
    'chat-window-closed'
  ],
  // From render to main
  send: [
    'chat-window-open',
    'chat-window-close',
    'settings-set',
  ],
  // From render to main and back again
  invoke: [
    'get-themes',
    'theme-load',
    'settings-get',
    'settings-reset',
    'toggle-game-mode',
    'get-widget-url',
  ]
};

contextBridge.exposeInMainWorld('ipcRenderer', {
  listen: (channel, listener) => {
    let validChannels = $ipc.listen;
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_, ...args) => listener(...args));
    }
  },
  send: (channel, args) => {
    let validChannels = $ipc.send;
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, args);
    }
  },
  invoke: (channel, args) => {
    let validChannels = $ipc.invoke;
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, args);
    }
  }
});