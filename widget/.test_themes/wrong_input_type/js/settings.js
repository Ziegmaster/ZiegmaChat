//THEME SETTINGS
(() => {
    const theme_defaults = {
        'chat-align': 'Left',
        'animate': true,
        'show-animation': 'bounceIn',
        'hide-animation': 'fadeOut',
        'hide-delay': 15000,
    };

    //Ensure default params present to run the widget correctly
    Object.entries(theme_defaults).forEach(value => {
        if (qpData[value[0]] === undefined) {
            qpData[value[0]] = value[1];
        }
    });
})();

settings.animations = {
    animation: qpData['animate'],
    hidedelay: qpData['hide-delay'],
    hideAnimation: qpData['hide-animation'],
    showAnimation: `${qpData['show-animation']}${qpData['chat-align']}`,
},
    settings.YouTube = {
        defaultChatColor: '#f20000',
    },
    settings.Twitch = {
        defaultChatColor: '#9147ff',
    };

const root = document.documentElement;
root.style.setProperty('--chat-align', qpData['chat-align'] == 'Left' ? 'row' : 'row-reverse');
root.style.setProperty('--font-size', `${qpData['font-size']}px`);