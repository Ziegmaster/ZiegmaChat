# About ZiegmaChat
This program aims to improve the streaming experience. It independently hosts a chat widget that communicates with [**Streamer.bot**](https://streamer.bot/) via its websocket API. All you have to do to see your chat in OBS is copy the link and paste it as a browser source in your scene.  
Navigate to the [**widget directory**](https://github.com/TrueZiegmaster/ZiegmaChat/tree/beta/widget) to see how to work with widget links and custom themes.

# Credits
Thanks to [**BlackyWhoElse**](https://github.com/BlackyWhoElse/streamer.bot-actions) for the chat widget that was modified for correct usage in this project.

<details>
<summary>

# Developing and building from source

</summary>

**Clone the project**
```console
git clone https://github.com/TrueZiegmaster/ZiegmaChat  
```
```console
cd ./ZiegmaChat
```

**Install dependencies**
```console
npm install
```

**Install dependencies for WSL**
```console
install --platform=win32
```
```console
npm_config_platform=win32 npm install
```

**Test the application**
```console
npm start
```
```console
npm run start
```

**Install electron-packager if missing**
```console
npm install -g electron-packager --save-dev
```

**Building the application**
```console
npm run build-windows
```
```console
npm run build-all
```

**Use electron-packager manually if you need other options.**
```console
electron-packager --help
```
</details>