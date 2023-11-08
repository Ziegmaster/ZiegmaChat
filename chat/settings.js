const urlParams = new URLSearchParams(window.location.search);

let root = document.documentElement;

let chatAlign = urlParams.get("chat-align") || "Left";
root.style.setProperty("--chat-align", chatAlign == "Left" ? "row" : "row-reverse");

let settings = {
    websocketURL: `ws://localhost:${urlParams.get("ws-port") || 8080}`,
    debug : {
        enabled : urlParams.get("debug") == "true",
        messageInterval : parseInt(urlParams.get("msg-interval")) || 4000
    },
    //Theme directory name
    template: urlParams.get("template") || "ziegmaster",
    filter : {
        //Max number of characters displayed per message (approx)
        characterLimit: parseInt(urlParams.get("char-limit")) || 150,
    },
    blacklist: {
        //List your bots here
        user: ["ZiegmaBot"],
        words: [],
        commands: false,
    },
    animations: {
        animation: true,
        hidedelay: parseInt(urlParams.get("hide-delay")) || 15000,
        hideAnimation: "fadeOut",
        showAnimation: `bounceIn${chatAlign}`,
    },
    YouTube: {
        defaultChatColor: "#f20000",
    },
    Twitch: {
        defaultChatColor: "#9147ff",
    },
};