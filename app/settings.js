const Store = require('electron-store');

const settings = new Store();

settings.set('defaults', {
    server : {
        port : 9600,
    },
    chat : {
        port : 8080,
        game_mode : false,
        debug : true,
    }
});

if (!settings.get('app')) settings.set('app', settings.get('defaults'));

//settings.set('app', settings.get('defaults'));

module.exports = settings;