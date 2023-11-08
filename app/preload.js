/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */

const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {

  let local_settings;

  const http_port = document.getElementById('chat-http-port');
  const ws_port = document.getElementById('streamerbot-ws-port');
  const copy = document.getElementById('copy');
  const open = document.getElementById('open');
  const apply = document.getElementById('apply');
  const debug = document.getElementById('debug-mode');
  const game_mode = document.getElementById('game-mode');

  enableApply = () => {apply.disabled = false}

  debug.addEventListener('change', enableApply);
  game_mode.addEventListener('change', enableApply);
  http_port.addEventListener('input', enableApply);
  ws_port.addEventListener('input', enableApply);

  copy.addEventListener('click', () => {
    ipcRenderer.send('copy');
  });
  open.addEventListener('click', () => {
    ipcRenderer.send(`chat-${open.className}`);
  });
  apply.addEventListener('click', () => {
    let data = {server : {}, chat : {}};
    const http_port_value = parseInt(http_port.value);
    const ws_port_value = parseInt(ws_port.value);
    if (http_port_value !== local_settings.server.port){
      data.server.port = http_port_value;
      local_settings.server.port = http_port_value;
    }
    if (ws_port_value !== local_settings.chat.port){
      data.chat.port = ws_port_value;
      local_settings.chat.port = ws_port_value;
    }
    if (debug.checked !== local_settings.chat.debug){
      data.chat.debug = debug.checked;
      local_settings.chat.debug = debug.checked;
    }
    if (game_mode.checked !== local_settings.chat.game_mode){
      data.chat.game_mode = game_mode.checked;
      local_settings.chat.game_mode = game_mode.checked;
    }
    apply.disabled = true;
    ipcRenderer.send('settings-set', data);
  });
  ipcRenderer.on('copy', (event, data) => {
    navigator.clipboard.writeText(data);
  });
  ipcRenderer.on('settings-get', (event, data) => {
    http_port.value = data.server.port;
    ws_port.value = data.chat.port;
    debug.checked = data.chat.debug;
    game_mode.checked = data.chat.game_mode;
    local_settings = data;
  });
  ipcRenderer.on('chat-closed', (event, data) => {
    open.innerText = 'Open';
    open.className = 'open';
  });
  ipcRenderer.on('chat-opened', (event, data) => {
    open.innerText = 'Close';
    open.className = 'close';
  });
  ipcRenderer.send('settings-get');
});