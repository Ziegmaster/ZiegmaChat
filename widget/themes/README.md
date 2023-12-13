# How to create your theme for ZiegmaChat

**Each theme should have the following structure:**
```
widget/your_theme_folder
    /css - optional
        styles.css
    /js - optional
        settings.js
    template.html - required
    theme.config.json - recommended
```

[Here](https://github.com/BlackyWhoElse/streamer.bot-actions/blob/main/widget/chat/theme/default/template.html) you can find example file.

# Config requirements

**`theme.config.json` file is needed to provide a theme configuration template to ZiegmaChat.**


**Minimal structure for `theme.config.json` to remove the error message is:**
```json
{
    "fields" : {}
}
```

**Any key inside the `fields` property is considered a query param, so name it properly.**


**Each query parameter should have the following structure:**
```json
{
    "label" : "...", // The text that will be displayed above the input
    "input-type" : "text|number|checkbox|select", // The type of the input tag
    "options" : [], // Options are required for select inputs only
    "value" : {
        "data-type" : "string|integer|number|boolean", // The type of value stored in settings
        "default" : "..." // The default value
    },
    "enabled" : true|false // You can interact with the input if it's enabled
}
```

**[schema](./schemas/theme.config.json) for `theme.config.json`**


**[Example](./widget/themes/ziegmaster/theme.config.json)**
