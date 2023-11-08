# ZiegmaChat
A Streamer.bot websocket based chat application built with Electron.

# Export widget URL
The list of query parameters to specify the widget behavior.

| Parameter | Possible values | Default value | Description |
| ------ | ------ | ------ | ------ |
| debug | empty, true | empty(false) | Enables "Debug mode". Allows you to test the application without using a real chat. |
| msg-interval | empty, value | empty(4000) | Sets the debug messages interval in miliseconds (1000 = 1 sec) |
| hide-delay | empty, value | empty(15000) | Sets the delay before messages disappear in miliseconds (1000 = 1 sec) |
| ws-port | empty, value | empty(8080) | Sets the websocket port to connect to Streamer.bot |
| theme | empty, value | empty(Ziegmaster) | Sets the name of template directory inside %ZiegmaChat%/resources/chat/theme |
