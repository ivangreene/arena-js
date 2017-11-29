const chai = require('chai');
const sinon = require('sinon');
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
const expect = chai.expect;

const Arena = require('../');
let arena, requestHandler;

beforeEach(function () {
  requestHandler = sinon.spy(function(method, url, data) {
    return Promise.resolve({
      contents: [],
      channels: []
    });
  });
  arena = new Arena({ requestHandler });
});

describe('Arena', function() {
  it('constructor should work', function() {
    expect(new Arena()).to.be.an.instanceof(Arena);
  });

  describe('.channel', function() {

    let channel;

    beforeEach(function() {
      channel = arena.channel('slug');
    });

    it('.get() should retrieve a channel', function() {
      return Promise.all([
        expect(channel.get({ page: 1, per: 2 })).to.eventually.have.property('contents'),
        expect(requestHandler).to.have.been.calledWith('get', 'channels/slug', 'page=1&per=2')
      ]);
    });

    it('.thumb() should retrieve a channel', function() {
      return Promise.all([
        expect(channel.thumb()).to.eventually.have.property('contents'),
        expect(requestHandler).to.have.been.calledWith('get', 'channels/slug/thumb')
      ]);
    });

    it('.connections() should get the connections in the channel', function() {
      return Promise.all([
        expect(channel.connections()).to.eventually.be.an('array'),
        expect(requestHandler).to.have.been.calledWith('get', 'channels/slug/connections')
      ]);
    });

    it('.channels() should get the channels connected to blocks in the channel', function() {
      return Promise.all([
        expect(channel.channels()).to.eventually.be.an('array'),
        expect(requestHandler).to.have.been.calledWith('get', 'channels/slug/channels')
      ]);
    });

    it('.contents() should get contents as an array', function() {
      return Promise.all([
        expect(channel.contents()).to.eventually.be.an('array'),
        expect(requestHandler).to.have.been.calledWith('get', 'channels/slug/contents')
      ]);
    });
  });

  describe('.getChannel', function() {
    it('should return a channel as an object', function() {
      return expect(arena.getChannel('slug')).to.eventually.have.property('contents');
    });
  });
});
