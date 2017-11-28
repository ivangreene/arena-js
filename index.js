const axios = require('axios');

class Arena {
  constructor({ requestHandler, baseUrl }) {
    this.requestHandler = requestHandler || (
      (method, url, data) => axios({ method, url, data }) 
    );
    this.baseUrl = baseUrl || 'http://api.are.na/v2/';
  }

  _req(method, url, data) {
    return this.requestHandler(method.toLowerCase(), this.baseUrl + url, data);
  }

  getChannel(slug, { page, per }) {
    return this._req('GET', '')
  }
}
