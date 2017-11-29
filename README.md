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
    - `baseURL`: Base URL to make requests on (default: `http://api.are.na/v2/`)
#### Example:
```js
let arena = new Arena({ accessToken: 'abcd' });
```

Methods that resolve with an Array will have an `attrs` property that contains the other data returned. For example, `channel(slug).connections()` will resolve with an Array of the channel's block's connections, and an `attrs` property containing properties like `length`, `total_pages`, `current_page`, etc.

### - `channel([slug || id][, params])`
####  - `.get([params])`
  - *`Promise<Object>`* - Get the channel as an Object. Gets a list of public channels if slug/id not specified.
####  - `.thumb([params])`
  - *`Promise<Object>`* - Limited view of the channel.
####  - `.connections([params])`
  - *`Promise<Array>`* - Get all of the connections of the channel (channels where this channel is connected).
####  - `.channels([params])`
  - *`Promise<Array>`* - Get all of the channels connected to blocks in the channel.
####  - `.contents([params])`
  - *`Promise<Array>`* - Get the channel's contents only, as an array.
####  - `.collaborators([params])`
  - *`Promise<Array>`* - Get the channel's collaborators.
####  - `.create([title || status][, status])`
  - *`Promise<Object>`* - Creates a new channel. Can be called as `channel(title).create([status])` or `channel().create(title[, status])`. Title is required, status is optional.
####  - `.delete([slug])`
  - *`Promise`* - Delete the channel. Can be called as `channel(slug).delete()` or `channel().delete(slug)`.
####  - `.update(params)`
  - *`Promise<Object>`* - Update the channel's attributes. `params` should be an object and can include `title` and/or `status`.
#### - `.addCollaborators(...userIds)`
  - *`Promise<Array>`* - Add collaborators to a channel. Pass userIds as an Array or multiple arguments. `channel(slug).addCollaborators(123, 456)` or `channel(slug).addCollaborators([123, 456])` works.
#### - `.deleteCollaborators(...userIds)`
  - *`Promise<Array>`* - Remove collaborators from a channel. Accepts userIds in the same format as addCollaborators.
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

### - `block(id[, params])`
####  - `.get([params])`
  - *`Promise<Object>`* - Get the block specified by id.
####  - `.channels([params])`
  - *`Promise<Array>`* - Get a list of the channels a block belongs to.
