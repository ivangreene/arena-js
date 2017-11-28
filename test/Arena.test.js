const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;

const Arena = require('../');
let arena;

beforeEach(function() {
  arena = new Arena();
});

describe('Arena', function() {
  it('constructor should work', function() {
    expect(new Arena()).to.be.an.instanceof(Arena);
  });

  describe('getChannel', function() {
    it('should return a channel as an object', function() {
      return expect(arena.getChannel('arena-influences')).to.eventually.have.property('contents');
    });
  });
});
