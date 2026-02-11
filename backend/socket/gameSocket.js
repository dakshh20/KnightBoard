// const { createGame, getGame } = require("../games/gameManager");

// const gamesMeta = {}; // players only

// module.exports = (io, socket) => {
//     socket.on("join_game", ({ gameId }) => {
//         socket.join(gameId);

//         // create chess game if not exists
//         const game = createGame(gameId);

//         if (!gamesMeta[gameId]) {
//             gamesMeta[gameId] = {
//                 players: [],
//                 colors: {} // socketId -> "w" | "b"
//             };
//         }

//         if (!gamesMeta[gameId].players.includes(socket.id)) {
//             if (gamesMeta[gameId].players.length < 2) {
//                 gamesMeta[gameId].players.push(socket.id);

//                 const assignedColor =
//                     gamesMeta[gameId].players.length === 1 ? "w" : "b";

//                 gamesMeta[gameId].colors[socket.id] = assignedColor;
//             }
//         }


//         console.log(`Socket ${socket.id} joined ${gameId}`);
//         console.log("Players:", gamesMeta[gameId].players);

//         // 🔥 SEND GAME STATE TO CLIENT
//         io.to(gameId).emit("game_state", {
//             fen: game.fen(),
//             players: gamesMeta[gameId].players,
//             colors: gamesMeta[gameId].colors,
//         });

//     });

//     socket.on("disconnect", () => {
//         for (const gameId in gamesMeta) {
//             gamesMeta[gameId].players = gamesMeta[gameId].players.filter(
//                 (id) => id !== socket.id
//             );
//         }
//     });

//     const { getGame } = require("../games/gameManager");

//     socket.on("make_move", ({ gameId, from, to }) => {
//         console.log("📥 make_move received:", {
//             socket: socket.id,
//             gameId,
//             from,
//             to
//         });
//         console.log("✅ Move accepted:", move.san);


//         const game = getGame(gameId);
//         if (!game) return;

//         const playerColor = gamesMeta[gameId]?.colors[socket.id];
//         if (!playerColor) return;

//         // turn enforcement
//         if (game.turn() !== playerColor) {
//             console.log("❌ Wrong turn");
//             return;
//         }

//         const move = game.move({
//             from,
//             to,
//             promotion: "q",
//         });

//         if (move === null) {
//             console.log("❌ Invalid move");
//             return;
//         }

//         console.log("✅ Move accepted:", move.san);

//         io.to(gameId).emit("game_state", {
//             fen: game.fen(),
//             players: gamesMeta[gameId].players,
//             colors: gamesMeta[gameId].colors,
//         });
//     });



// };

const { Chess } = require("chess.js");

const games = {};
// gameId -> { chess, players: [], colors: {} }

module.exports = (io, socket) => {

    socket.on("join_game", ({ gameId }) => {
        socket.join(gameId);

        if (!games[gameId]) {
            games[gameId] = {
                chess: new Chess(),
                players: [],
                colors: {}
            };
        }

        const game = games[gameId];

        // assign player if not already
        if (!game.players.includes(socket.id) && game.players.length < 2) {
            game.players.push(socket.id);

            const color = game.players.length === 1 ? "w" : "b";
            game.colors[socket.id] = color;

            // 🔐 send color ONLY to this client
            socket.emit("player_color", { color });

            console.log("ASSIGNED:", socket.id, color);
        }

        // send board state
        io.to(gameId).emit("game_state", {
            fen: game.chess.fen()
        });
    });

    socket.on("make_move", ({ gameId, from, to }) => {
        const game = games[gameId];
        if (!game) return;

        const myColor = game.colors[socket.id];
        if (!myColor) return;

        // 🔒 Turn enforcement
        if (game.chess.turn() !== myColor) {
            console.log("❌ Wrong turn");
            return;
        }

        let move;
        try {
            move = game.chess.move({
                from,
                to,
                promotion: "q",
            });
        } catch (err) {
            console.log("❌ Invalid move attempt:", from, to);
            return;
        }

        if (!move) return;

        console.log("✅ Move accepted:", move.san);

        io.to(gameId).emit("game_state", {
            fen: game.chess.fen(),
        });
    });


    socket.on("disconnect", () => {
        for (const gameId in games) {
            const game = games[gameId];
            game.players = game.players.filter(id => id !== socket.id);
            delete game.colors[socket.id];
        }
    });
};
