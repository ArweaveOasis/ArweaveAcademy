# Communication-bridge

* [Overview](#Overview)
* [Installation](#Installation)
* [API Usage](#API-Usage)
* [Copyright and License](#Copyright-and-License)

### Overview

A cross-domain communication library develop by Rand Labs that enables send and receive messages between browser windows/tabs.

### Instalation

The library can be installed via npm:

```sh
npm i @randlabs/communication-bridge
```

### API Usage

Import and define the communication channel

```js
const Messenger = require("@randlabs/communication-bridge");
const channelName = "channel name";
```

#### Tab #1

```js
const client = new Messenger(channelName); // If listener is undefined, it will ignore all incoming request

const window = window.open("https://another.website.com");

const response = await client.sendMessage(window, { customMethod: "doSomething" }, { waitForReply: true, origin: "*" }); // If you are sending sensitive data, put a specific origin, for example: https://another.website.com

console.log(response); // { response: "OK" }

```

#### Tab #2

```js
const hub = new Messenger(channelName, function(data, origin, source, sendResponse) {
    console.log(data); // { customMethod: "doSomething" }
    sendResponse({ response: "OK" });
});

```

### Copyright and License  

See [LICENSE](LICENSE.md) file.
