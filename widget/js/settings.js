//GENERAL SETTINGS

const qpData = (() => {

    const result = {};

    const defaults = {
        'theme': 'ziegmaster',
        'debug': false,
        'msg-interval': 4000,
        'char-limit': 150,
        'ws-port': 8080,
    };

    const urlParams = new URLSearchParams(window.location.search);

    urlParams.forEach((value, key) => {
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
    template: qpData['theme'],
    filter: {
        //Max number of characters displayed per message (approx)
        characterLimit: qpData['char-limit'],
    },
    blacklist: {
        //List your bots here
        user: ['ZiegmaBot'],
        words: [],
        commands: false,
    }
};