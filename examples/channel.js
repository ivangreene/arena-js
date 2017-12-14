const Arena = require('../');
let arena = new Arena();


arena.channel('arena-influences').contents({ page: 1, per: 3 })
  .then(contents => {
    contents.map(content => {
      console.log(content.title);
    });
  })
  .catch(err => console.log(err));
