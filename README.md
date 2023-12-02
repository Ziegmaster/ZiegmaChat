# ZiegmaChat
Websocket based chat application for Streamer.bot.
Built with Electron.
Ready to use for Twitch streamers.

# Export widget URL
The list of query parameters to specify the widget behavior.

| **Parameter** | **Possible values** | If omitted | **Description** |
| ------ | ------ | ------ | ------ |
| debug | **[boolean]** values | false | Enables "Debug mode". Allows you to test the application without using a real chat. |
| msg-interval | **[int]** values | 4000 | Debug messages interval in miliseconds (1000 = 1 sec). |
| ws-port | **[int]** values | 8080 | Websocket port to connect to Streamer.bot |
| theme | **[string]** values | ziegmaster | Name of theme directory inside **../%ZiegmaChat%/resources/widget/themes** |
| char-limit | **[int]** values | 150 | Approximate limit for trimming a message that is too long. |

# Use your own CSS and templates
Navigate to **../%ZiegmaChat%/resources/widget/themes** and see what you can do.

# Building from source
electron packager %PATH_TO_APP_FOLDER% name --platform=win32 --arch=x64 --icon=./favicon.ico
> Note: widget directory must be placed inside **%YOUR_BUILD%/resources**

# Credits
Thanks to [**BlackyWhoElse**](https://github.com/BlackyWhoElse/streamer.bot-actions) for the chat widget that was modified for correct usage in this project.