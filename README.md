# ZiegmaChat
Websocket based chat application for Streamer.bot.  
Built with Electron.  
Ready to use for Twitch streamers.  

# Export widget URL
The list of general query parameters to specify the widget behavior.

| **Parameter** | **Possible values** | If omitted | **Description** |
| ------ | ------ | ------ | ------ |
| debug | **[bool]** values | false | Enables "Debug mode". Allows you to test the application without using a real chat. |
| msg-interval | **[int]** values | 4000 | Debug messages interval in miliseconds (1000 = 1 sec). |
| ws-port | **[int]** values | 8080 | Websocket port to connect to Streamer.bot |
| theme | **[text]** values | ziegmaster | Name of theme directory inside **../%ZiegmaChat%/resources/widget/themes** |
| char-limit | **[int]** values | 150 | Approximate limit for trimming a message that is too long. |

> Note: theme specific parameters can be found inside theme directories

# Use your own CSS and templates
Navigate to **../%ZiegmaChat%/resources/widget/themes** and see what you can do.

# Developing and building from source
**Clone the project**
> git clone https://github.com/TrueZiegmaster/ZiegmaChat  
> cd ./Ziegmachat

**Install dependencies**
> npm install

**Install dependencies for WSL**
> npm install --platform=win32  

or  
> npm_config_platform=win32 npm install

**Test the application**
> npm start  

or  
> npm run start

**Install electron-packager if missing**
> npm install -g electron-packager --save-dev

**Building the application**
> npm run build-windows  
> npm run build-all  

**Use electron-packager manually if you need other options.**
> electron-packager --help

# Credits
Thanks to [**BlackyWhoElse**](https://github.com/BlackyWhoElse/streamer.bot-actions) for the chat widget that was modified for correct usage in this project.