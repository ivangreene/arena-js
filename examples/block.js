const Arena = require('../');
let arena = new Arena();

arena.block(8693).get()
  .then(block => console.log(block.title))
  .catch(console.error);
