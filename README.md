# are.na API wrapper for JavaScript

Uses [Axios](https://github.com/axios/axios), which is Promise-based and compatible with Node.js/io.js or modern browsers. Use it server side, or in your React, Vue or Angular apps.

## Installation

Available from npm:
```bash
$ npm install are.na

# or:

$ yarn add are.na
```

## Example

```js
const Arena = require('are.na');

const arena = new Arena();

arena.channel('arena-influences').get()
  .then(chan => {
    chan.contents.map(item => {
      console.log(item.title);
    });
  })
  .catch(err => console.log(err));
```

## Usage

The class is organized hierarchically as nested objects. Emulates the [are.na api documentation](https://dev.are.na/documentation/) structure.

### - `new Arena([config])`
  - Config can optionally be passed as an object:
    - `accessToken`: Your are.na API access token
    - `baseURL`: Base URL to make requests on (default: `https://api.are.na/v2/`)
#### Example:
```js
let arena = new Arena({ accessToken: 'abcd' });
```

Methods that resolve with an Array will have an `attrs` property that contains the other data returned. For example, `channel(slug).connections()` will resolve with an Array of the channel's block's connections, and an `attrs` property containing properties like `length`, `total_pages`, `current_page`, etc.

Some methods have pagination available. Pass `params` as an object, in the form `{ page: 3, per: 10 }`.

### `channel([slug || id][, params])`


Method | Returns | Description
--- | --- | ---
`.get([params])` | *`Promise<Object>`* | Get the channel as an Object. Gets a list of public channels if slug/id not specified. Supports pagination.
`.thumb([params])` | *`Promise<Object>`* | Limited view of the channel.
`.connections([params])` | *`Promise<Array>`* | Get all of the connections of the channel (channels where this channel is connected). Supports pagination.
`.channels([params])` | *`Promise<Array>`* | Get all of the channels connected to blocks in the channel. Supports pagination.
`.contents([params])` | *`Promise<Array>`* | Get the channel's contents only, as an array. Supports pagination.
`.collaborators([params])` | *`Promise<Array>`* | Get the channel's collaborators. Supports pagination.
`.create([title \|\| status][, status])` | *`Promise<Object>`* | Creates a new channel. Can be called as `channel(title).create([status])` or `channel().create(title[, status])`. Title is required, status is optional.
`.delete([slug])` | *`Promise`* | Delete the channel. Can be called as `channel(slug).delete()` or `channel().delete(slug)`.
`.update(params)` | *`Promise<Object>`* | Update the channel's attributes. `params` should be an object and can include `title` and/or `status`. Currently it appears that the are.na API requires both values. If `title` is not set, an error will occur. If `status` is not set, it will default to "public".
`.addCollaborators(...userIds)` | *`Promise<Array>`* | Add collaborators to a channel. Pass userIds as an Array or multiple arguments. `channel(slug).addCollaborators(123, 456)` or `channel(slug).addCollaborators([123, 456])` works.
`.deleteCollaborators(...userIds)` | *`Promise<Array>`* | Remove collaborators from a channel. Accepts userIds in the same format as addCollaborators.
`.createBlock(content\|\|source)` | *`Promise<Object>`* | Create a block and add it to the channel. Specify textual content or a source link.
`.deleteBlock(blockId)` | *`Promise`* | Remove a block from the channel.

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

// Create a new channel called "beautiful foods" that is closed
arena.channel('beautiful foods').create('closed');
// or
arena.channel().create('beautiful foods', 'closed')
  .then(chan => console.log('Slug: ' + chan.slug))
  .catch(err => console.log(err));
```

### `block([id][, params])`
Method | Returns | Description
--- | --- | ---
`.get([params])` | *`Promise<Object>`* | Get the block specified by id.
`.channels([params])` | *`Promise<Array>`* | Get a list of the channels a block belongs to.
`.create(channelSlug, content \|\| source)` | *`Promise<Object>`* | Create a block and add it to the channel. Specify textual content or a source link.
`.update({ content, title, description })` | *`Promise`* | Update a block. Pass an object with one or more of content, title or description fields to update those fields.

#### Example:
```js
// Get a block, print its title
arena.block(8693).get()
  .then(block => console.log(block.title))
  .catch(console.error);

// Create a block in the channel 'great-websites'
arena.block().create('great-websites', 'https://are.na/');

// Update a block
arena.block('65234').update({ content: 'New content', title: 'New title', description: 'New description' });
```

### `user(id || slug[, params])`
Method | Returns | Description
--- | --- | ---
`.get([params])` | *`Promise<Object>`* | Get a user specified by id.
`.channels([params])` | *`Promise<Array>`* | Get a user's channels, as an array. Supports pagination.
`.following([params])` | *`Promise<Array>`* | Get a list of users and/or blocks the user is following. Supports pagination.
`.followers([params])` | *`Promise<Array>`* | Get a list of the user's followers. Supports pagination.

#### Example:
```js
// Get a user, print their name
arena.user(23484).get().then(user => console.log(user.full_name));
```

### `search(query[, params])`
All methods support pagination.

Method | Returns | Description
--- | --- | ---
`.all([params])` | *`Promise<Object>`* | Search for channels, blocks, and users matching query. (The API currently only seems to return channels and blocks, and the users array will be empty?)
`.users([params])` | *`Promise<Array>`* | Search for users.
`.channels([params])` | *`Promise<Array>`* | Search for channels.
`.blocks([params])` | *`Promise<Array>`* | Search for blocks.

#### Example:
```js
// Get the 2nd page of 3 channel results for 'art',
// print links to them
arena.search('art').channels({ page: 2, per: 3})
  .then(channels => {
    channels.map(chan => {
      console.log('https://www.are.na/channels/' + chan.slug);
    });
  });
```
