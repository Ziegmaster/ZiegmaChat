//GENERAL SETTINGS

const qpData = (() => {

    const result = {};

    const defaults = {
        'theme': 'ziegmaster',
        'debug': false,
        'msg-interval': 4000,
        'char-limit': 150,
        'spam-protection': 20,
        'hide-links': true,
        'bots': [],
        'ws-port': 8080,
        'animate': true,
        'show-animation': 'bounceIn',
        'hide-animation': 'fadeOut',
        'hide-delay': 15000,
    };

    const urlParams = new URLSearchParams(window.location.search);

    urlParams.forEach((value, key) => {
        switch(key){
            case 'bots':
                result[key] = value.split(',');
                break;
            default:
                result[key] = (() => {
                    const intValue = parseInt(value);
                    if (!isNaN(intValue)) {
                        return intValue;
                    }
                    if (value === 'true') {
                        return true;
                    }
                    if (value === 'false') {
                        return false;
                    }
                    return value;
                })();
                break;
        }
    });

    //Ensure default params present to run the widget correctly
    Object.entries(defaults).forEach(value => {
        if (result[value[0]] === undefined) {
            result[value[0]] = value[1];
        }
    });

    return result;
})();

const settings = {
    websocketURL: `ws://localhost:${qpData['ws-port']}`,
    debug: {
        enabled: qpData['debug'],
        messageInterval: qpData['msg-interval']
    },
    //Theme directory name
    template: encodeURIComponent(qpData['theme']),
    filter: {
        //Max number of characters displayed per message (approx)
        characterLimit: qpData['char-limit'],
        spamProtection: qpData['spam-protection'],
        hideLinks: qpData['hide-links']
    },
    blacklist: {
        user: qpData['bots'],
        words: [],
        commands: false,
    },
    animations: {
        animation: qpData['animate'],
        hidedelay: qpData['hide-delay'],
        hideAnimation: qpData['hide-animation'],
        showAnimation: `${qpData['show-animation']}Right`
    },
    YouTube: {
        defaultChatColor: '#f20000',
    },
    Twitch: {
        defaultChatColor: '#9147ff',
    }
};