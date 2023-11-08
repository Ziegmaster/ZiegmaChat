# ZiegmaChat
A Streamer.bot websocket based chat application built with Electron.
Ready to use for Twitch streamers.

# Export widget URL
The list of query parameters to specify the widget behavior.

| **Parameter** | **Possible values** | **Default value** (when empty) | **Description** |
| ------ | ------ | ------ | ------ |
| debug | empty, true | false | Enables "Debug mode". Allows you to test the application without using a real chat. |
| msg-interval | empty, value | 4000 | Debug messages interval in miliseconds (1000 = 1 sec). |
| hide-delay | empty, value | 15000 | Delay before messages disappear in miliseconds (1000 = 1 sec). |
| ws-port | empty, value | 8080 | Websocket port to connect to Streamer.bot |
| theme | empty, value | Ziegmaster | Name of theme directory inside **../%ZiegmaChat%/resources/chat/theme** |
| char-limit | empty, value | 150 | Approximate limit for trimming a message that is too long. |
| chat-align | empty, left, right | left | Horizontal alignment of chat messages. |

# Use your own CSS and templates
Navigate to **../%ZiegmaChat%/resources/chat/theme** and see what you can do.

# Building from source
Note: chat directory must be placed inside **../%ZiegmaChat%/resources**

# Credits
Thanks to [**BlackyWhoElse**](https://github.com/BlackyWhoElse/streamer.bot-actions) for the chat widget that was modified for correct usage in this project.
