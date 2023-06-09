const Server = require('./Server');

const server = new Server();

(async() => {
  await server.start();
})();
