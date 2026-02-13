const { randomUUID } = require("crypto");

const games = new Map();

function createGame(socketId) {
  const gameId = randomUUID();

  const game = {
    gameId,
    players: {
      white: socketId,
      black: null,
    },
    status: "WAITING",
    chess: null,
  };

  games.set(gameId, game);
  return game;
}

function joinGame(gameId, socketId) {
  const game = games.get(gameId);
  if (!game) throw new Error("Game not found");
  if (game.players.black) throw new Error("Game full");

  game.players.black = socketId;
  game.status = "ACTIVE";
  return game;
}

function getGame(gameId) {
  return games.get(gameId);
}

module.exports = {
  createGame,
  joinGame,
  getGame,
};
