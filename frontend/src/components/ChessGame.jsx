import React, { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import socket from "../socket";

function ChessGame({ mode }) {
  const [fen, setFen] = useState("start");
  const [myColor, setMyColor] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [gameStatus, setGameStatus] = useState("WAITING");
  const [turn, setTurn] = useState(null);

  useEffect(() => {
    if (mode === "online") {
      socket.emit("findMatch");
    }

    socket.on("gameCreated", (data) => {
      setGameId(data.gameId);
      setMyColor("w");
      setGameStatus("ACTIVE");
    });

    socket.on("gameJoined", (data) => {
      setGameId(data.gameId);
      setMyColor("b");
      setGameStatus("ACTIVE");
    });

    socket.on("gameStarted", (data) => {
      setTurn(data.turn);
    });

    socket.on("game_state", (data) => {
      setFen(data.fen);
      setTurn(data.turn);
    });

    return () => {
      socket.off("gameCreated");
      socket.off("gameJoined");
      socket.off("gameStarted");
      socket.off("game_state");
    };
  }, [mode]);

  const onPieceDrop = (from, to) => {
    if (gameStatus !== "ACTIVE") return false;
    if (turn !== myColor) return false;

    socket.emit("make_move", { gameId, from, to });
    return true;
  };

  const createRoom = () => socket.emit("createGame");
  const joinRoom = () => {
    const id = prompt("Enter Room ID");
    if (id) socket.emit("joinGame", { gameId: id });
  };

  return (
    <div style={{ width: 420, margin: "40px auto" }}>
      {mode === "friend" && !gameId && (
        <div style={{ marginBottom: 10 }}>
          <button onClick={createRoom}>Create Room</button>
          <button onClick={joinRoom} style={{ marginLeft: 10 }}>
            Join Room
          </button>
        </div>
      )}

      <Chessboard
        position={fen}
        boardOrientation={myColor === "b" ? "black" : "white"}
        isDraggablePiece={({ piece }) =>
          piece && piece[0] === myColor && turn === myColor
        }
        onPieceDrop={onPieceDrop}
      />

      <p style={{ textAlign: "center" }}>Game ID: {gameId || "—"}</p>
      <p style={{ textAlign: "center" }}>
        You: {myColor === "w" ? "White" : "Black"}
      </p>
      <p style={{ textAlign: "center" }}>
        Turn: {turn === "w" ? "White" : "Black"}
      </p>
    </div>
  );
}

export default ChessGame;
