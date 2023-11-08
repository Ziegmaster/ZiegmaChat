# ZiegmaChat
A Streamer.bot websocket based chat application built with Electron.
Ready to use for Twitch streamers.

# Export widget URL
The list of query parameters to specify the widget behavior.

| **Parameter** | **Possible values** | **Default value** | **Description** |
| ------ | ------ | ------ | ------ |
| debug | empty, true | empty(false) | Enables "Debug mode". Allows you to test the application without using a real chat. |
| msg-interval | empty, value | empty(4000) | Debug messages interval in miliseconds (1000 = 1 sec). |
| hide-delay | empty, value | empty(15000) | Delay before messages disappear in miliseconds (1000 = 1 sec). |
| ws-port | empty, value | empty(8080) | Websocket port to connect to Streamer.bot |
| theme | empty, value | empty(Ziegmaster) | Name of template directory inside **../%ZiegmaChat%/resources/chat/theme** |
| char-limit | empty, value | empty(150) | An approximate limit for trimming of a message that is too long. |
| chat-align | empty, left, right | empty(left) | Horizontal alignment of chat messages. |

# Building from source
Note: chat directory must be placed inside **../%ZiegmaChat%/resources**
