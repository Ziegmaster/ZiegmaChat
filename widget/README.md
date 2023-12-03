# Export widget URL
The list of general query parameters to specify the widget behavior.

| **Parameter** | **Possible values** | If omitted | **Description** |
| ------ | ------ | ------ | ------ |
| debug | **[bool]** values | false | Enables "Debug mode". Allows you to test the application without using a real chat. |
| msg-interval | **[int]** values | 4000 | Debug messages interval in miliseconds (1000 = 1 sec). |
| ws-port | **[int]** values | 8080 | Websocket port to connect to Streamer.bot |
| theme | **[text]** values | ziegmaster | Name of theme directory inside [themes directory](themes) |
| char-limit | **[int]** values | 150 | Approximate limit for trimming a message that is too long. |

# Use your own custom themes and query parameters
Navigate to [themes directory](themes) and see what you can do.