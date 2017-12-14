const Arena = require('../');
let arena = new Arena();

arena.user(23484).get().then(user => console.log(user.full_name));
