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
        expect(arena.channel().get({ page: 3, per: 10 })).to.eventually.
          have.property('channels'),
        expect(requestHandler).to.have.been.calledWith('get', 'channels/',
          'page=3&per=10')
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
        expect(requestHandler).to.have.been.calledWith('get',
          'channels/arena-influences')
      ]);
    });

    it('.thumb() should retrieve a channel', function() {
      return Promise.all([
        expect(channel.thumb()).to.eventually.have.property('contents'),
        expect(requestHandler).to.have.been.calledWith('get',
          'channels/arena-influences/thumb')
      ]);
    });

    it('.connections() should get the connections in the channel', function() {
      return Promise.all([
        expect(channel.connections()).to.eventually.be.an('array'),
        expect(requestHandler).to.have.been.calledWith('get',
          'channels/arena-influences/connections')
      ]);
    });

    it('.channels() should get the channels connected to blocks in the channel'
      , function() {
      return Promise.all([
        expect(channel.channels()).to.eventually.be.an('array'),
        expect(requestHandler).to.have.been.calledWith('get',
          'channels/arena-influences/channels')
      ]);
    });

    it('.contents() should get contents as an array', function() {
      return Promise.all([
        expect(channel.contents()).to.eventually.be.an('array'),
        expect(requestHandler).to.have.been.calledWith('get',
          'channels/arena-influences/contents')
      ]);
    });

    it('.collaborators() should get collaborators as an array', function () {
      return Promise.all([
        expect(channel.collaborators()).to.eventually.be.an('array'),
        expect(requestHandler).to.have.been.calledWith('get',
          'channels/arena-influences/collaborators')
      ]);
    });
  });

  describe('.block(id)', function() {
    let block;

    beforeEach(function () {
      block = arena.block(8693);
    });

    it('.get() should get the block', function () {
      return Promise.all([
        expect(block.get()).to.eventually.be.an('object'),
        expect(requestHandler).to.have.been.calledWith('get',
          'blocks/8693')
      ]);
    });

    it('.channels() should get the channels the block belongs to',
      function () {
        return Promise.all([
          expect(block.channels()).to.eventually.be.an('array'),
          expect(requestHandler).to.have.been.calledWith('get',
            'blocks/8693/channels')
        ]);
      });
  });

  describe('.user(id)', function () {
    let user;

    beforeEach(function () {
      user = arena.user(23484);
    });

    it('.get() should get the user', function () {
      return Promise.all([
        expect(user.get()).to.eventually.be.an('object'),
        expect(requestHandler).to.have.been.calledWith('get',
          'users/23484')
      ]);
    });

    it('.channels() should get their channels', function () {
      return Promise.all([
        expect(user.channels()).to.eventually.be.an('array'),
        expect(requestHandler).to.have.been.calledWith('get',
          'users/23484/channels')
      ]);
    });

    it('.following() should get who they are following', function () {
      return Promise.all([
        expect(user.following()).to.eventually.be.an('array'),
        expect(requestHandler).to.have.been.calledWith('get',
          'users/23484/following')
      ]);
    });

    it('.followers() should get their followers', function () {
      return Promise.all([
        expect(user.followers()).to.eventually.be.an('array'),
        expect(requestHandler).to.have.been.calledWith('get',
          'users/23484/followers')
      ]);
    });
  });

  describe('.search(query)', function () {
    let search;

    beforeEach(function () {
      search = arena.search('art');
    });

    it('.all() should search for query', function () {
      return Promise.all([
        expect(search.all()).to.eventually.be.an('object'),
        expect(requestHandler).to.have.been.calledWith('get',
          'search', 'q=art')
      ]);
    });

    it('.users() should search for users', function () {
      return Promise.all([
        expect(search.users()).to.eventually.be.an('array'),
        expect(requestHandler).to.have.been.calledWith('get',
          'search/users', 'q=art')
      ]);
    });

    it('.channels() should search for channels', function () {
      return Promise.all([
        expect(search.channels()).to.eventually.be.an('array'),
        expect(requestHandler).to.have.been.calledWith('get',
          'search/channels', 'q=art')
      ]);
    });

    it('.blocks() should search for blocks', function () {
      return Promise.all([
        expect(search.blocks()).to.eventually.be.an('array'),
        expect(requestHandler).to.have.been.calledWith('get',
          'search/blocks', 'q=art')
      ]);
    });
  });

});
