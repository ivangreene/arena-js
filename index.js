const axios = require('axios');

class Arena {
  constructor(opts) {
    opts = opts || {};
    this.requestHandler = opts.requestHandler || (
      (method, url, data) => axios({ method, url, data }).then(({data}) => data)
    );
    this.baseUrl = opts.baseUrl || 'http://api.are.na/v2/';
  }

  _req(method, url, data) {
    return this.requestHandler(method.toLowerCase(), this.baseUrl + url, data);
  }

  channel(slug, data) {
    return {
      get: (opts) => this._req('GET', 'channels/' + slug, Object.assign({}, data, opts)),
      thumb: (opts) => this._req('GET', 'channels/' + slug + '/thumb', Object.assign({}, data, opts)),
      connections: (opts) => this._req('GET', 'channels/' + slug + '/connections', Object.assign({}, data, opts)),
      channels: (opts) => this._req('GET', 'channels/' + slug + '/channels', Object.assign({}, data, opts)),
      contents: (opts) => this._req('GET', 'channels/' + slug + '/contents', Object.assign({}, data, opts)).then(({contents}) => contents),
      // new: (title, status) => this._req('POST', 'channels', { title, status })
    }
  }

  getChannel(slug, data) {
    return this.channel(slug, data).get();
  }
}

module.exports = Arena;
