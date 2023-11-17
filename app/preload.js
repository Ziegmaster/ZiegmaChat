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

  //TOP BUTTONS
  const copy = document.getElementById('copy');
  const open = document.getElementById('open');
  const apply = document.getElementById('apply');
  const discard = document.getElementById('discard');
  const debug = document.getElementById('debug-mode');

  //NAVBAR BUTTONS
  const reset_to_defaults = document.getElementById('reset-to-defaults');

  //VALUE CONTAINERS
  const http_port = document.getElementById('chat-http-port');
  const ws_port = document.getElementById('streamerbot-ws-port');
  const game_mode = document.getElementById('game-mode');
  const chat_theme = document.getElementById('chat-theme');
  const chat_align_right = document.getElementById('chat-align-right');
  const chat_msg_hide_delay = document.getElementById('chat-msg-hide-delay');
  const chat_char_limit = document.getElementById('chat-char-limit');
  const chat_font_size = document.getElementById('chat-font-size');

  toggleApplyOn = () => {
    apply.classList.remove('disabled');
    apply.classList.add('green');
    discard.classList.remove('disabled');
    discard.classList.add('red');
    copy.classList.remove('common');
    copy.classList.add('disabled');
  }
  toggleApplyOff = () => {
    apply.classList.remove('green');
    apply.classList.add('disabled');
    discard.classList.remove('red');
    discard.classList.add('disabled');
    copy.classList.remove('disabled');
    copy.classList.add('common');
  }

  debug.addEventListener('change', toggleApplyOn);
  http_port.addEventListener('input', toggleApplyOn);
  ws_port.addEventListener('input', toggleApplyOn);
  chat_theme.addEventListener('input', toggleApplyOn);
  chat_align_right.addEventListener('change', toggleApplyOn);
  chat_msg_hide_delay.addEventListener('input', toggleApplyOn);
  chat_char_limit.addEventListener('input', toggleApplyOn);
  chat_font_size.addEventListener('input', toggleApplyOn);

  open.addEventListener('click', () => {
    ipcRenderer.send(`chat-${open.classList.contains('font') ? 'close' : 'open'}`);
  });
  game_mode.addEventListener('click', () => {
    if (local_settings.chat.game_mode){
      game_mode.classList.remove('font');
      game_mode.classList.add('disabled');
      local_settings.chat.game_mode = false;
      ipcRenderer.send('settings-set', {server : {}, chat : {game_mode : false}});
    }
    else{
      game_mode.classList.remove('disabled');
      game_mode.classList.add('font');
      local_settings.chat.game_mode = true;
      ipcRenderer.send('settings-set', {server : {}, chat : {game_mode : true}});
    }
  });
  copy.addEventListener('click', () => {
    ipcRenderer.send('copy');
  });
  apply.addEventListener('click', () => {
    let data = {server : {}, chat : {}};
    const http_port_value = parseInt(http_port.value);
    const ws_port_value = parseInt(ws_port.value);
    const hide_delay_value = parseInt(chat_msg_hide_delay.value);
    const char_limit_value = parseInt(chat_char_limit.value);
    const font_size_value = parseInt(chat_font_size.value);
    if (http_port_value < 0 || http_port_value > 65535){
      http_port.value = local_settings.server.port;
    }
    else if (http_port_value !== local_settings.server.port){
      data.server.port = http_port_value;
      local_settings.server.port = http_port_value;
    }
    if (ws_port_value < 0 || ws_port_value > 65535){
      ws_port.value = local_settings.chat.port;
    }
    else if (ws_port_value !== local_settings.chat.port){
      data.chat.port = ws_port_value;
      local_settings.chat.port = ws_port_value;
    }
    if (debug.checked !== local_settings.chat.debug){
      data.chat.debug = debug.checked;
      local_settings.chat.debug = debug.checked;
    }
    if (chat_theme.value !== local_settings.chat.theme){
      data.chat.theme = chat_theme.value;
      local_settings.chat.theme = chat_theme.value;
    }
    if (chat_align_right.checked !== local_settings.chat.align_right){
      data.chat.align_right = chat_align_right.checked;
      local_settings.chat.align_right = chat_align_right.checked;
    }
    if (hide_delay_value !== local_settings.chat.hide_delay){
      data.chat.hide_delay = hide_delay_value;
      local_settings.chat.hide_delay = hide_delay_value;
    }
    if (char_limit_value !== local_settings.chat.char_limit){
      data.chat.char_limit = char_limit_value;
      local_settings.chat.char_limit = char_limit_value;
    }
    if (font_size_value !== local_settings.chat.font_size){
      data.chat.font_size = font_size_value;
      local_settings.chat.font_size = font_size_value;
    }
    toggleApplyOff();
    ipcRenderer.send('settings-set', data);
  });
  discard.addEventListener('click', () => {
    http_port.value = local_settings.server.port;
    ws_port.value = local_settings.chat.port;
    debug.checked = local_settings.chat.debug;
    chat_theme.value = local_settings.chat.theme;
    chat_align_right.checked = local_settings.chat.align_right;
    chat_msg_hide_delay.value = local_settings.chat.hide_delay;
    chat_char_limit.value = local_settings.chat.char_limit;
    chat_font_size.value = local_settings.chat.font_size;
    toggleApplyOff();
  });
  reset_to_defaults.addEventListener('click', () => {
    ipcRenderer.send('reset-to-defaults');
  });
  document.querySelectorAll('.navbar > .app-button.tab-ref').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelector('.tab.active').classList.remove('active');
      let tab = document.querySelector(`.tab.${button.id}`);
      tab.classList.add('active');
      document.getElementById('tab-label').innerText = tab.dataset.name;
    });
  });
  ipcRenderer.on('copy', (event, data) => {
    navigator.clipboard.writeText(data);
  });
  ipcRenderer.on('settings-get', (event, data) => {
    http_port.value = data.server.port;
    ws_port.value = data.chat.port;
    debug.checked = data.chat.debug;
    chat_theme.value = data.chat.theme;
    chat_align_right.checked = data.chat.align_right;
    chat_msg_hide_delay.value = data.chat.hide_delay;
    chat_char_limit.value = data.chat.char_limit;
    chat_font_size.value = data.chat.font_size; 
    if(data.chat.game_mode){
      game_mode.classList.remove('disabled');
      game_mode.classList.add('font');
    }
    else{
      game_mode.classList.remove('font');
      game_mode.classList.add('disabled');
    }
    local_settings = data;
  });
  ipcRenderer.on('chat-closed', (event, data) => {
    open.classList.remove('font');
    open.classList.add('disabled');
  });
  ipcRenderer.on('chat-opened', (event, data) => {
    open.classList.remove('disabled');
    open.classList.add('font');
  });
  ipcRenderer.send('settings-get');
});