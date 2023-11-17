# ZiegmaChat
A Streamer.bot websocket based chat application built with Electron.  
Ready to use for Twitch streamers.

# Export widget URL
The list of query parameters to specify the widget behavior.

| **Parameter** | **Possible values** | When empty | **Description** |
| ------ | ------ | ------ | ------ |
| debug | empty, true | false | Enables "Debug mode". Allows you to test the application without using a real chat. |
| msg-interval | empty, value | 4000 | Debug messages interval in miliseconds (1000 = 1 sec). |
| hide-delay | empty, value | 15000 | Delay before messages disappear in miliseconds (1000 = 1 sec). |
| ws-port | empty, value | 8080 | Websocket port to connect to Streamer.bot |
| theme | empty, value | ziegmaster | Name of theme directory inside **../%ZiegmaChat%/resources/widget/theme** |
| char-limit | empty, value | 150 | Approximate limit for trimming a message that is too long. |
| chat-align | empty, Left, Right | Left | Horizontal alignment of chat messages. |
| font-size | empty, value | 32 | Value needed for text and UI scaling. |

# Use your own CSS and templates
Navigate to **../%ZiegmaChat%/resources/widget/theme** and see what you can do.

# Building from source
electron packager %PATH_TO_APP_FOLDER% name --platform=win32 --arch=x64 --icon=./favicon.ico
> Note: widget directory must be placed inside **%YOUR_BUILD%/resources**

# Credits
Thanks to [**BlackyWhoElse**](https://github.com/BlackyWhoElse/streamer.bot-actions) for the chat widget that was modified for correct usage in this project.
