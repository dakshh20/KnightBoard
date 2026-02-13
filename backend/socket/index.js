const gameSocket = require("./gameSocket");

module.exports = (io) => {
  io.on("connection", (socket) => {
    gameSocket(io, socket);
  });
};
