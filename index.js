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
    this.axios = axios.create({
      baseURL: opts.baseURL || 'https://api.are.na/v2/',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: (opts.accessToken ? 'Bearer ' + opts.accessToken : undefined)
      }
    });
    this.requestHandler = opts.requestHandler || (
      (method, url, data) => this.axios.request({ method, url, data }).then(({data}) => data)
    );
  }

  _req(method, url, ...data) {
    return this.requestHandler(method.toLowerCase(), url, qs.stringify(Object.assign({}, ...data), {indices:false}));
  }

  channel(slug, data) {
    slug = slug || '';
    return {
      get: (opts) => this._req('GET', 'channels/' + slug, data, opts),
      thumb: (opts) => this._req('GET', 'channels/' + slug + '/thumb', data, opts),
      connections: (opts) => this._req('GET', 'channels/' + slug + '/connections', data, opts)
        .then(pullObject('channels')),
      channels: (opts) => this._req('GET', 'channels/' + slug + '/channels', data, opts)
        .then(pullObject('channels')),
      contents: (opts) => this._req('GET', 'channels/' + slug + '/contents', data, opts)
        .then(pullObject('contents')),
      collaborators: (opts) => this._req('GET', 'channels/' + slug + '/collaborators', data, opts)
        .then(pullObject('users')),
      create: (title, status) => this._req('POST', 'channels', {
        // Allow it to be called as .channel(title).create(status) or .channel().create(title, status)
        title: slug || title, status: slug ? title : status
      }),
      delete: (deleteSlug) => this._req('DELETE', 'channels/' + (slug || deleteSlug)),
      update: (opts) => this._req('PUT', 'channels/' + slug, opts),
      addCollaborators: (...ids) => this._req('POST', 'channels/' + slug + '/collaborators', {'ids[]': arrayOrList(ids)})
        .then(pullObject('users')),
      deleteCollaborators: (...ids) => this._req('DELETE', 'channels/' + slug + '/collaborators', {'ids[]': arrayOrList(ids)})
        .then(pullObject('users'))
    }
  }

  getChannel(slug, data) {
    return this.channel(slug, data).get();
  }

  block(id, data) {
    return {
      get: (opts) => this._req('GET', 'blocks/' + id, data, opts),
      channels: (opts) => this._req('GET', 'blocks/' + id + '/channels', data, opts)
        .then(pullObject('channels'))
    }
  }
}

module.exports = Arena;
