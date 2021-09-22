const Arena = require('../');
let arena = new Arena({
    accessToken: process.env.ARENA_ACCESS_TOKEN
});

arena.me().get().then(user => console.log(user.full_name));
