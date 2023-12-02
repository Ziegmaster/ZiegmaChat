const Store = require('electron-store');

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
        },
        themes: {
            /*
            * Dynamic object. Content is generated from ziegmachat.config.json 
            */
        },
    },
});

if (!settings.get('app')) settings.set('app', settings.get('defaults'));

module.exports = settings;