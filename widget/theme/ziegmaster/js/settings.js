//STYLE SETTINGS

const root = document.documentElement;

root.style.setProperty('--chat-align', qpData['chat-align'] == 'Left' ? 'row' : 'row-reverse');
root.style.setProperty('--font-size', `${qpData['font-size']}px`);

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