// import React, { useEffect, useState } from "react";
// import { Chessboard } from "react-chessboard";
// import socket from "../socket";

// const GAME_ID = "game-123";


// function ChessGame() {
//     const [fen, setFen] = useState("start");
//     const [myColor, setMyColor] = useState(null);

//     // useEffect(() => {
//     //     socket.on("game_state", (data) => {
//     //         console.log("🟢 Game state update:", data.fen);
//     //         setFen(data.fen);
//     //         setMyColor(data.colors[socket.id]);
//     //     });

//     //     return () => socket.off("game_state");
//     // }, []);

//     useEffect(() => {
//         socket.on("game_state", (data) => {
//             console.log("📡 game_state received:", data.fen);
//             setFen(data.fen);
//         });

//         socket.on("player_color", (data) => {
//             console.log("🎨 player_color:", data.color);
//             setMyColor(data.color);
//         });

//         return () => {
//             socket.off("game_state");
//             socket.off("player_color");
//         };
//     }, []);


//     const onPieceDrop = (from, to) => {
//         if (!myColor) return false;

//         socket.emit("make_move", {
//             gameId: GAME_ID,
//             from,
//             to,
//         });

//         // IMPORTANT:
//         // We return true so the drag completes,
//         // but the board will re-render ONLY
//         // when server sends updated FEN
//         return true;
//     };


//     return (
//         <div style={{ width: "400px", margin: "50px auto" }}>
//             <Chessboard
//                 position={fen}
//                 boardOrientation={myColor === "b" ? "black" : "white"}
//                 arePiecesDraggable={true}
//                 isDraggablePiece={({ piece }) => {
//                     if (!myColor) return false;
//                     // piece example: "wP", "bK"
//                     return piece[0] === myColor;
//                 }}
//                 onPieceDrop={onPieceDrop}
//             />

//             <p style={{ textAlign: "center" }}>
//                 You are playing: {myColor === "w" ? "White" : "Black"}
//             </p>
//             <button onClick={() => setFen("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1")}>
//                 Force Move Test
//             </button>

//         </div>
//     );
// }

// export default ChessGame;

import React, { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import socket from "../socket";

const GAME_ID =
    localStorage.getItem("gameId") ||
    (() => {
        const id = "game-" + Math.random().toString(36).substring(2, 8);
        localStorage.setItem("gameId", id);
        return id;
    })();


function ChessGame() {
    const [fen, setFen] = useState("start");
    const [myColor, setMyColor] = useState(null);

    useEffect(() => {
        socket.emit("join_game", { gameId: GAME_ID });

        socket.on("player_color", (data) => {
            console.log("MY COLOR:", data.color);
            setMyColor(data.color);
        });

        socket.on("game_state", (data) => {
            setFen(data.fen);
        });

        return () => {
            socket.off("player_color");
            socket.off("game_state");
        };
    }, []);

    const onPieceDrop = (from, to) => {
        if (!myColor) return false;

        socket.emit("make_move", {
            gameId: GAME_ID,
            from,
            to
        });

        return true;
    };

    return (
        <div style={{ width: 420, margin: "40px auto" }}>
            <Chessboard
                position={fen}
                boardOrientation={myColor === "b" ? "black" : "white"}
                arePiecesDraggable={true}
                isDraggablePiece={({ piece }) =>
                    piece && piece[0] === myColor
                }
                onPieceDrop={onPieceDrop}
            />
            <p style={{ textAlign: "center" }}>
                You are playing: {myColor === "w" ? "White" : "Black"}
            </p>
        </div>
    );
}

export default ChessGame;
