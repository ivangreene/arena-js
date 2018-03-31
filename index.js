const axios = require('axios');
const qs = require('qs');

// Helper to deal with pulling an inner object out of returned data
// and then assigning other data as "attrs"
const pullObject = key => object => {
  let newObj = object[key];
  delete object[key];
  Object.defineProperty(newObj, 'attrs', {
    value: object
  });
  return newObj;
};

// Helper to accept an array or multiple arguments
// and convert to array
const arrayOrList = list => {
  if (typeof list[0] === 'object' || typeof list[0] === 'array') {
    return list[0];
  }
  return list;
};

class Arena {
  constructor(opts) {
    opts = opts || {};
    let headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    if (opts.accessToken) {
      headers.Authorization = 'Bearer ' + opts.accessToken;
    }
    this.axios = axios.create({
      baseURL: opts.baseURL || 'https://api.are.na/v2/',
      headers
    });
    this.requestHandler = opts.requestHandler || (
      (method, url, data) => this.axios.request({ method, url, data })
        .then(({data}) => data)
    );
  }

  _req(method, url, ...data) {
    return this.requestHandler(method.toLowerCase(), url,
      qs.stringify(Object.assign({}, ...data), {indices:false}));
  }

  channel(slug, data) {
    slug = slug || '';
    return {
      get: (opts) => this._req('GET', 'channels/' + slug, data, opts),

      thumb: (opts) => this._req('GET', 'channels/' + slug + '/thumb',
        data, opts),

      connections: (opts) => this._req('GET',
        'channels/' + slug + '/connections', data, opts)
          .then(pullObject('channels')),

      channels: (opts) => this._req('GET', 'channels/' + slug + '/channels',
        data, opts)
          .then(pullObject('channels')),

      contents: (opts) => this._req('GET', 'channels/' + slug + '/contents',
        data, opts)
          .then(pullObject('contents')),

      collaborators: (opts) => this._req('GET',
        'channels/' + slug + '/collaborators', data, opts)
          .then(pullObject('users')),

      create: (title, status) => this._req('POST', 'channels', {
        // Allow it to be called as .channel(title).create(status) or
        // .channel().create(title, status)
        title: slug || title, status: slug ? title : status
      }),

      delete: (deleteSlug) => this._req('DELETE',
        'channels/' + (slug || deleteSlug)),

      update: (opts) => this._req('PUT', 'channels/' + slug, opts),

      addCollaborators: (...ids) => this._req('POST',
        'channels/' + slug + '/collaborators', {'ids[]': arrayOrList(ids)})
          .then(pullObject('users')),

      deleteCollaborators: (...ids) => this._req('DELETE',
        'channels/' + slug + '/collaborators', {'ids[]': arrayOrList(ids)})
          .then(pullObject('users')),

      createBlock: (content) => {
        let block = { content };
        if (content.match(/^https?:\/\//)) {
          block = { source: content };
        }
        return this._req('POST', 'channels/' + slug + '/blocks', block);
      },

      deleteBlock: (id) => this._req('DELETE',
        'channels/' + slug + '/blocks/' + id)
    }
  }

  block(id, data) {
    return {
      get: (opts) => this._req('GET', 'blocks/' + id, data, opts),

      channels: (opts) => this._req('GET',
        'blocks/' + id + '/channels', data, opts)
          .then(pullObject('channels')),

      create: (channel, content) => this.channel(channel).createBlock(content),

      update: (opts) => this._req('PUT', 'blocks/' + id, data, opts)
    }
  }

  user(id, data) {
    return {
      get: (opts) => this._req('GET', 'users/' + id, data, opts),

      channels: (opts) => this._req('GET', 'users/' + id + '/channels',
        data, opts)
          .then(pullObject('channels')),

      following: (opts) => this._req('GET', 'users/' + id + '/following',
        data, opts)
          .then(pullObject('following')),

      followers: (opts) => this._req('GET', 'users/' + id + '/followers',
        data, opts)
          .then(pullObject('users')),
    }
  }

  search(q, data) {
    return {
      all: (opts) => this._req('GET', 'search', {q}, data, opts),

      users: (opts) => this._req('GET', 'search/users', {q}, data, opts)
        .then(pullObject('users')),

      channels: (opts) => this._req('GET', 'search/channels', {q}, data, opts)
        .then(pullObject('channels')),

      blocks: (opts) => this._req('GET', 'search/blocks', {q}, data, opts)
        .then(pullObject('blocks')),
    };
  }

}

module.exports = Arena;
