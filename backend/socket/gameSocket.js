const { Chess } = require("chess.js");
const {
  createGame,
  joinGame,
  getGame,
} = require("../games/gameManager");

let matchmakingQueue = [];

module.exports = (io, socket) => {
  console.log("Socket connected:", socket.id);

  // =========================
  // PLAY ONLINE (MATCHMAKING)
  // =========================
  socket.on("findMatch", () => {
    if (matchmakingQueue.length > 0) {
      const whiteId = matchmakingQueue.shift();
      const whiteSocket = io.sockets.sockets.get(whiteId);
      if (!whiteSocket) return;

      const game = createGame(whiteId);
      game.chess = new Chess();

      whiteSocket.join(game.gameId);
      socket.join(game.gameId);

      joinGame(game.gameId, socket.id);

      whiteSocket.emit("gameCreated", {
        gameId: game.gameId,
        color: "w",
      });

      socket.emit("gameJoined", {
        gameId: game.gameId,
        color: "b",
      });

      io.to(game.gameId).emit("gameStarted", {
        turn: "w",
      });

      io.to(game.gameId).emit("game_state", {
        fen: game.chess.fen(),
        turn: "w",
      });
    } else {
      matchmakingQueue.push(socket.id);
    }
  });

  // =========================
  // FRIEND MODE
  // =========================
  socket.on("createGame", () => {
    const game = createGame(socket.id);
    game.chess = new Chess();

    socket.join(game.gameId);

    socket.emit("gameCreated", {
      gameId: game.gameId,
      color: "w",
    });
  });

  socket.on("joinGame", ({ gameId }) => {
    const game = joinGame(gameId, socket.id);

    socket.join(gameId);

    socket.emit("gameJoined", {
      gameId,
      color: "b",
    });

    io.to(gameId).emit("gameStarted", {
      turn: game.chess.turn(),
    });

    io.to(gameId).emit("game_state", {
      fen: game.chess.fen(),
      turn: game.chess.turn(),
    });
  });

  // =========================
  // MOVES
  // =========================
  socket.on("make_move", ({ gameId, from, to }) => {
    const game = getGame(gameId);
    if (!game || game.status !== "ACTIVE") return;

    try {
      const move = game.chess.move({ from, to });
      if (!move) return;
    } catch {
      return;
    }

    io.to(gameId).emit("game_state", {
      fen: game.chess.fen(),
      turn: game.chess.turn(),
    });
  });

  socket.on("disconnect", () => {
    matchmakingQueue = matchmakingQueue.filter(
      (id) => id !== socket.id
    );
  });
};
