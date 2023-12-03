window.addEventListener('DOMContentLoaded', async () => {

    let localSettings;

    // TOP BUTTONS
    const openButton = document.getElementById('open');
    const gameModeCheckBox = document.getElementById('game-mode');
    const copyButton = document.getElementById('copy');
    const applyButton = document.getElementById('apply');
    const discardButton = document.getElementById('discard');

    // NAVBAR BUTTONS
    const resetToDefaults = document.getElementById('reset-to-defaults');

    // STATIC VALUE CONTAINERS
    const httpPortInput = document.getElementById('http-port');
    const wsPortInput = document.getElementById('ws-port');
    const debugCheckBox = document.getElementById('debug');
    const charLimitInput = document.getElementById('char-limit');
    const themeSelect = document.getElementById('theme');

    const toggleApplyOn = () => {
        applyButton.classList.remove('disabled');
        discardButton.classList.remove('disabled');
        copyButton.classList.add('disabled');
    }

    const toggleApplyOff = () => {
        applyButton.classList.add('disabled');
        discardButton.classList.add('disabled');
    }

    const toggleCopyOn = () => {
        copyButton.classList.remove('disabled');
    }

    const getThemes = async () => {
        const themes = await window.ipcRenderer.invoke('get-themes');
        themeSelect.innerHTML = null;
        const emptyOption = document.createElement('option');
        emptyOption.toggleAttribute('selected');
        emptyOption.toggleAttribute('disabled');
        emptyOption.toggleAttribute('hidden');
        emptyOption.value = '#';
        if (themes.length > 0) {
            emptyOption.innerText = 'Please select';
            themes.sort().forEach(theme => {
                const option = document.createElement('option');
                option.value = theme;
                option.innerText = theme;
                themeSelect.append(option);
            });
        }
        else {
            emptyOption.innerText = 'Folder is empty';
        }
        themeSelect.prepend(emptyOption);
    }

    const loadTheme = (theme) => {
        window.ipcRenderer.invoke('theme-load', theme).then(themeData => {
            const tab = document.querySelector('.tab.theme-settings');
            tab.innerHTML = null;
            if (themeData) {
                themeData.config.fields?.forEach(field => {
                    const block = document.createElement('div');
                    block.className = 'block';
                    const label = document.createElement('label');
                    label.setAttribute('for', field.name);
                    label.innerText = field.label;
                    block.append(label);
                    if (field.type == 'select') {
                        const select = document.createElement('select');
                        select.className = 'theme-qp-input';
                        select.dataset.qpName = field.name;
                        select.dataset.valueType = field.value.type;
                        field.options.forEach((optionText, index) => {
                            const option = document.createElement('option');
                            option.value = optionText;
                            option.innerText = optionText;
                            select.append(option);
                        });
                        if (!field.enabled) {
                            select.toggleAttribute('disabled');
                        }
                        if (themeData.settings && themeData.settings[field.name] !== undefined) {
                            select.value = themeData.settings[field.name];
                        }
                        else {
                            select.value = field.value.default;
                        }
                        select.addEventListener('change', toggleApplyOn);
                        block.append(select);
                    }
                    else {
                        const input = document.createElement('input');
                        input.type = field.type;
                        input.className = 'theme-qp-input';
                        input.dataset.qpName = field.name;
                        input.dataset.valueType = field.value.type;
                        if (!field.enabled) {
                            input.toggleAttribute('disabled');
                        }
                        if (field.type == 'checkbox') {
                            const br = document.createElement('br');
                            const labelSwitch = document.createElement('label');
                            labelSwitch.className = 'switch';
                            const slider = document.createElement('span');
                            slider.className = 'slider round';
                            block.append(br);
                            if (themeData.settings && themeData.settings[field.name] !== undefined) {
                                input.checked = themeData.settings[field.name];
                            }
                            else {
                                input.checked = field.value.default;
                            }
                            input.addEventListener('change', toggleApplyOn);
                            labelSwitch.append(input);
                            labelSwitch.append(slider);
                            block.append(labelSwitch);
                        }
                        else {
                            if (themeData.settings && themeData.settings[field.name] !== undefined) {
                                input.value = themeData.settings[field.name];
                            }
                            else {
                                input.value = field.value.default;
                            }
                            input.addEventListener('input', toggleApplyOn);
                            block.append(input);
                        }
                    }
                    tab.append(block);
                });
                localSettings.widget.themes[theme] = themeData.settings;
                toggleCopyOn();
            }
        });
    }

    const getSettings = () => {
        window.ipcRenderer.invoke('settings-get').then(settings => {
            localSettings = settings;
            httpPortInput.value = settings.server.port;
            wsPortInput.value = settings.widget.general['ws-port'];
            debugCheckBox.checked = settings.widget.general['debug'];
            charLimitInput.value = settings.widget.general['char-limit'];
            if (settings.widget.gameMode) {
                gameModeCheckBox.classList.remove('disabled');
            }
            else {
                gameModeCheckBox.classList.add('disabled');
            }
            if (themeSelect.querySelector(`option[value="${settings.widget.general['theme']}"]`)) {
                themeSelect.value = settings.widget.general['theme'];
                loadTheme(settings.widget.general['theme']);
                toggleCopyOn();
            }
            toggleApplyOff();
        });
    }

    debugCheckBox.addEventListener('change', toggleApplyOn);
    httpPortInput.addEventListener('input', toggleApplyOn);
    wsPortInput.addEventListener('input', toggleApplyOn);
    themeSelect.addEventListener('change', toggleApplyOn);
    charLimitInput.addEventListener('input', toggleApplyOn);

    /*
    * APPEND ACTIONS TO TOP BUTTONS
    */
    openButton.addEventListener('click', function () {
        if (this.classList.contains('disabled')) {
            window.ipcRenderer.send('chat-window-open');
        } else {
            window.ipcRenderer.send('chat-window-close');
        }
    });

    gameModeCheckBox.addEventListener('click', function () {
        window.ipcRenderer.invoke('toggle-game-mode').then(gameMode => {
            localSettings.widget.gameMode = gameMode;
            if (gameMode) {
                this.classList.remove('disabled');
            }
            else {
                this.classList.add('disabled');
            }
        });
    });

    copyButton.addEventListener('click', () => {
        window.ipcRenderer.invoke('get-widget-url').then(url => {
            navigator.clipboard.writeText(url);
        });
    });

    applyButton.addEventListener('click', () => {
        const changedSettings = { server: {}, widget: { general: {}, themes: {} } };
        const httpPortValue = parseInt(httpPortInput.value);
        const wsPortValue = parseInt(wsPortInput.value);
        const charLimitValue = parseInt(charLimitInput.value);
        // Save current theme changed settings in case of theme change
        changedSettings.widget.themes[localSettings.widget.general['theme']] = {};
        document.querySelectorAll('.theme-qp-input').forEach(input => {
            const localValue = localSettings.widget.themes[localSettings.widget.general['theme']][input.dataset.qpName];
            if (input.tagName == 'select' || input.type != 'checkbox') {
                let inputValue = input.value;
                switch (input.dataset.valueType) {
                    case 'int':
                        inputValue = parseInt(inputValue);
                        break;
                    case 'float':
                        inputValue = parseFloat(inputValue);
                        break;
                    default:
                        break;
                }
                if (inputValue !== localValue) {
                    changedSettings.widget.themes[localSettings.widget.general['theme']][input.dataset.qpName] = inputValue;
                    localSettings.widget.themes[localSettings.widget.general['theme']][input.dataset.qpName] = inputValue;
                }
            }
            else {
                if (input.checked !== localValue) {
                    changedSettings.widget.themes[localSettings.widget.general['theme']][input.dataset.qpName] = input.checked;
                    localSettings.widget.themes[localSettings.widget.general['theme']][input.dataset.qpName] = input.checked;
                }
            }
        });
        if (httpPortValue < 0 || httpPortValue > 65535) {
            httpPortInput.value = localSettings.server.port;
        }
        else if (httpPortValue !== localSettings.server.port) {
            changedSettings.server.port = httpPortValue;
            localSettings.server.port = httpPortValue;
        }
        if (wsPortValue < 0 || wsPortValue > 65535) {
            wsPortInput.value = localSettings.widget.general['ws-port'];
        }
        else if (wsPortValue !== localSettings.widget.general['ws-port']) {
            changedSettings.widget.general['ws-port'] = wsPortValue;
            localSettings.widget.general['ws-port'] = wsPortValue;
        }
        if (debugCheckBox.checked !== localSettings.widget.general['debug']) {
            changedSettings.widget.general['debug'] = debugCheckBox.checked;
            localSettings.widget.general['debug'] = debugCheckBox.checked;
        }
        if (charLimitValue !== localSettings.widget.general['char-limit']) {
            changedSettings.widget.general['char-limit'] = charLimitValue;
            localSettings.widget.general['char-limit'] = charLimitValue;
        }
        if (themeSelect.value !== localSettings.widget.general['theme']) {
            changedSettings.widget.general['theme'] = themeSelect.value;
            localSettings.widget.general['theme'] = themeSelect.value;
            loadTheme(themeSelect.value);
        }
        else{
            toggleCopyOn();
        }
        toggleApplyOff();
        window.ipcRenderer.send('settings-set', changedSettings);
    });

    discardButton.addEventListener('click', () => {
        httpPortInput.value = localSettings.server.port;
        wsPortInput.value = localSettings.widget.general['ws-port'];
        debugCheckBox.checked = localSettings.widget.general['debug'];
        charLimitInput.value = localSettings.widget.general['char-limit'];
        document.querySelectorAll('.theme-qp-input').forEach(input => {
            const localValue = localSettings.widget.themes[localSettings.widget.general['theme']][input.dataset.qpName];
            if (input.tagName == 'select' || input.type != 'checkbox') {
                input.value = localValue;
            }
            else {
                input.checked = localValue;
            }
        });
        if (themeSelect.querySelector(`option[value="${localSettings.widget.general['theme']}"]`)) {
            themeSelect.value = localSettings.widget.general['theme'];
            toggleApplyOff();
            toggleCopyOn();
        }
        else {
            themeSelect.value = '#';
            toggleApplyOff();
        }
    });

    /*
    * APPEND TAB SWITCH ACTIONS TO NAVBAR BUTTONS
    */
    document.querySelectorAll('.navbar > .app-button.tab-ref').forEach(button => {
        button.addEventListener('click', () => {
            const tab = document.querySelector(`.tab.${button.id}`);
            document.querySelector('.tab.active').classList.remove('active');
            document.getElementById('tab-label').innerText = tab.dataset.title;
            tab.classList.add('active');
        });
    });

    /*
    * APPEND ACTION TO RESET BUTTON
    */
    resetToDefaults.addEventListener('click', () => {
        window.ipcRenderer.invoke('settings-reset').then((response) => {
            if (response) {
                getSettings();
            }
        });
    });

    /*
    * APPEND ACTIONS TO BACKEND COMMANDS
    */
    window.ipcRenderer.listen('chat-window-opened', () => {
        openButton.classList.remove('disabled');
    });
    window.ipcRenderer.listen('chat-window-closed', () => {
        openButton.classList.add('disabled');
    });

    await getThemes();
    getSettings();
});