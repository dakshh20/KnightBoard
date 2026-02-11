const { Chess } = require("chess.js");

const games = {}; // gameId -> Chess instance

function createGame(gameId) {
    if (!games[gameId]) {
        games[gameId] = new Chess();
    }
    return games[gameId];
}

function getGame(gameId) {
    return games[gameId];
}

module.exports = {
    createGame,
    getGame,
};
