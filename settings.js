const Store = require('electron-store');
const windowStateKeeper = require('electron-window-state');

const settings = new Store();

settings.set('defaults', {
    server: {
        port: 9600,
    },
    widget: {
        gameMode: false,
        general: {
            /*
            * These values are treated as query params so they are represented in a string format
            */
            'ws-port': 8080,
            'debug': true,
            'char-limit': 150,
            'theme': 'ziegmaster',
            'spam-protection' : 20,
            'hide-links' : true,
            'bots' : [
                'ExampleBot1',
                'ExampleBot2',
                'ZiegmaBot'
            ]
        },
        themes: {
            /*
            * Dynamic object. Content is generated from ziegmachat.config.json 
            */
        },
    },
});

if (!settings.get('app')) settings.set('app', settings.get('defaults'));

module.exports = {
    settings,
    mainWindowState : () => {
        return windowStateKeeper({
            file: 'main.json',
        });
    },
    chatWindowState : () => {
        return windowStateKeeper({
            file: 'chat.json',
            defaultWidth: 800,
            defaultHeight: 600,
        });
    }
};