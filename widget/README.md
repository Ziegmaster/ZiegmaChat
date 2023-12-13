# General query params
| **Parameter** | **Possible values** | If omitted | **Description** |
| ------ | ------ | ------ | ------ |
| debug | any **[boolean]** | false | Enables "Debug mode". Allows you to test the application without using a real chat. |
| msg-interval | any **[integer]** | 4000 | Debug messages interval in miliseconds (1000 = 1 sec). |
| ws-port | any **[integer]** | 8080 | Websocket port to connect to Streamer.bot |
| theme | any **[string]** | ziegmaster | Name of theme directory inside [themes directory](themes) |
| char-limit | any **[integer]** | 150 | Approximate limit for trimming a message that is too long. |
| hide-links | any **[boolean]** | true | Replaces clickable links and emails with [link] and [email]. |
| spam-protection | any **[integer]** | 20 | Hides messages which contain words longer than n characters (0 to disable). |
| bots | any | **[array[string]]** | ExampleBot1,ExampleBot2,ZiegmaBot | List of bots to ignore their messages. |

# Overridable animation query params
| **Parameter** | **Possible values** | If omitted | **Description** |
| ------ | ------ | ------ | ------ |
| animate | any **[boolean]** | true | Enables widget animation |
| hide-delay | any **[integer]** | 15000 | Delay before message disappears (0 to disable). |
| show-animation | any **[string]** | bounceIn(Right) | Sets an animation for message appear event. |
| hide-animation | any **[string]** | fadeOut | Sets an animation for message hide event. |

# Use your own custom themes and query params
Navigate to [themes directory](themes) and see what you can do.