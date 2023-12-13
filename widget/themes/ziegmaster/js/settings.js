//THEME SETTINGS
(() => {
    const theme_defaults = {
        'chat-align': 'Left',
    };

    //Ensure default params present to run the widget correctly
    Object.keys(theme_defaults).forEach(key => {
        if (qpData[key] === undefined) {
            qpData[key] = theme_defaults[key];
        }
    });
})();

//Override settings
settings.animations.showAnimation = `${qpData['show-animation']}${qpData['chat-align']}`;

const root = document.documentElement;
root.style.setProperty('--chat-align', qpData['chat-align'] == 'Left' ? 'row' : 'row-reverse');
root.style.setProperty('--font-size', `${qpData['font-size']}px`);