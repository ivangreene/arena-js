const axios = require('axios');

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

class Arena {
  constructor(opts) {
    opts = opts || {};
    this.axios = axios.create({
      baseURL: opts.baseURL || 'http://api.are.na/v2/',
      headers: opts.accessToken ? { Authorization: 'Bearer ' + opts.accessToken } : undefined
    });
    this.requestHandler = opts.requestHandler || (
      (method, url, data) => this.axios.request({ method, url, data }).then(({data}) => data)
    );
  }

  _req(method, url, ...data) {
    return this.requestHandler(method.toLowerCase(), url, Object.assign({}, ...data));
  }

  channel(slug, data) {
    return {
      get: (opts) => this._req('GET', 'channels/' + slug, data, opts),
      thumb: (opts) => this._req('GET', 'channels/' + slug + '/thumb', data, opts),
      connections: (opts) => this._req('GET', 'channels/' + slug + '/connections', data, opts)
        .then(pullObject('channels')),
      channels: (opts) => this._req('GET', 'channels/' + slug + '/channels', data, opts)
        .then(pullObject('channels')),
      contents: (opts) => this._req('GET', 'channels/' + slug + '/contents', data, opts)
        .then(pullObject('contents')),
      // new: (title, status) => this._req('POST', 'channels', { title, status })
    }
  }

  getChannel(slug, data) {
    return this.channel(slug, data).get();
  }

  block(id, data) {
    return {
      get: (opts) => this._req('GET', 'blocks/' + id, data, opts),
      channels: (opts) => this._req('GET', 'blocks/' + id + '/channels', data, opts)
    }
  }
}

module.exports = Arena;
