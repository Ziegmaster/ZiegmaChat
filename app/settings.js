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
        hide_delay : 15000,
        char_limit : 150,
        align_right : false,
        font_size : 32,
        theme : "ziegmaster",
    }
});

if (!settings.get('app')) settings.set('app', settings.get('defaults'));

module.exports = settings;