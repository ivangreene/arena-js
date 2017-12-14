const Arena = require('../');
let arena = new Arena();

arena.search('art').channels({ page: 2, per: 3})
  .then(channels => {
    channels.map(chan => {
      console.log('https://www.are.na/channels/' + chan.slug);
    });
  });
