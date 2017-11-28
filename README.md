# are.na API wrapper for JavaScript

Uses [Axios](https://github.com/axios/axios), which is Promise-based and compatible with Node.js/io.js or modern browsers. Use it server side, or in your React, Vue or Angular apps.

## Installation

Available from npm:
```bash
$ npm install are.na

# or:

$ yarn add are.na
```

## Usage

```js
const Arena = require('are.na');

const arena = new Arena();

arena.channel('mindfuck').get()
  .then(chan => {
    chan.contents.map(item => {
      console.log(`${item.title} - ${item.source.url}`);
    });
  })
  .catch(err => console.log(err));
```

## Methods Available

The class is organized hierarchically as nested objects. Emulates the [are.na api documentation](https://dev.are.na/documentation/) structure.

### - `channel([slug || id] [, params])`
  - `.get([params])` - *`Promise<Object>`* - get the channel. Gets a list of public channels if slug/id not specified.
  - `.thumb([params])` - *`Promise<Object>`* - limited view of the channel.
  - `.connections([params])` - *`Promise<Object>`*
  - `.channels([params])` - *`Promise<Object>`*
  - `.contents([params])` - *`Promise<Array>`*
#### Example:
```js
// Get first 3 pieces of content from a channel and print their titles
arena.channel('arena-influences').contents({ page: 1, per: 3 })
  .then(contents => {
    contents.map(content => {
      console.log(content.title);
    });
  })
  .catch(err => console.log(err));
```
