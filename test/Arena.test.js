const chai = require('chai');
const sinon = require('sinon');
const fs = require('fs');
const path = require('path');
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
const expect = chai.expect;

const Arena = require('../');
let arena, requestHandler;

beforeEach(function () {
  requestHandler = sinon.spy(function(method, url, data) {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, 'staged', method,
        'api.are.na/v2', url.replace(/\/$/, '') + '?' + data),
        'utf8', (err, data) => {
          if (err) return reject(err);
          resolve(JSON.parse(data));
        });
    });
  });
  arena = new Arena({ requestHandler });
});

describe('Arena', function() {
  it('constructor should work', function() {
    expect(new Arena()).to.be.an.instanceof(Arena);
  });

  describe('.channel()', function () {

    it('.get() should be a list of channels', function () {
      return Promise.all([
        expect(arena.channel().get({ page: 3, per: 10 })).to.eventually.have.property('channels'),
        expect(requestHandler).to.have.been.calledWith('get', 'channels/', 'page=3&per=10')
      ]);
    });

  });

  describe('.channel(slug)', function() {

    let channel;

    beforeEach(function() {
      channel = arena.channel('arena-influences');
    });

    it('.get() should retrieve a channel', function() {
      return Promise.all([
        expect(channel.get()).to.eventually.have.property('contents'),
        expect(requestHandler).to.have.been.calledWith('get', 'channels/arena-influences')
      ]);
    });

    it('.thumb() should retrieve a channel', function() {
      return Promise.all([
        expect(channel.thumb()).to.eventually.have.property('contents'),
        expect(requestHandler).to.have.been.calledWith('get', 'channels/arena-influences/thumb')
      ]);
    });

    it('.connections() should get the connections in the channel', function() {
      return Promise.all([
        expect(channel.connections()).to.eventually.be.an('array'),
        expect(requestHandler).to.have.been.calledWith('get', 'channels/arena-influences/connections')
      ]);
    });

    it('.channels() should get the channels connected to blocks in the channel', function() {
      return Promise.all([
        expect(channel.channels()).to.eventually.be.an('array'),
        expect(requestHandler).to.have.been.calledWith('get', 'channels/arena-influences/channels')
      ]);
    });

    it('.contents() should get contents as an array', function() {
      return Promise.all([
        expect(channel.contents()).to.eventually.be.an('array'),
        expect(requestHandler).to.have.been.calledWith('get', 'channels/arena-influences/contents')
      ]);
    });
  });
});
