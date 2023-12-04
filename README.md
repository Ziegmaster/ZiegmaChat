<h1 align="center">For streamers by a streamer</h1>
<p align="center">
This program aims to improve the streaming experience. It independently hosts a chat widget that communicates with 
<a href="https://streamer.bot/">Streamer.Bot</a> via its websocket API. 
All you have to do to see your chat in OBS is copy the link and paste it as a browser source in your scene. 
Navigate to the <a href="widget">widget directory</a> 
to see how to work with widget links and custom themes.
</p>

<p align="center"><b>Hey streamer! <a href="USERGUIDE.md">This user guide</a> is special for you! Don't miss it!</b></p>

# 🎮 Game mode
ZiegmaChat has an extremely useful feature for streamers with only one screen. 
In this mode, a second program window is launched, which can be freely placed anywhere on the screen. 
After customizing its size and position, you can use a special switch to turn it into a gaming overlay.

> [!NOTE]  
> There are games that force themselves to always be on top of everything. It is recommended to play them in windowed mode to see the overlay.

# 👍 Credits
Thanks to [BlackyWhoElse](https://github.com/BlackyWhoElse/streamer.bot-actions) 
for the chat widget that was modified for correct usage in this project.

<details>
<summary>

# 🌐 Developing and building from source

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
npm install --platform=win32
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
```console
npm run wsl
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
