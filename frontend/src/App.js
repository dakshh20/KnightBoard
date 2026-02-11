import React, { useEffect } from "react";
import ChessGame from "./components/ChessGame";
import socket from "./socket";

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);

      socket.emit("join_game", {
        gameId: "game-123",
      });
    });

    socket.on("player_joined", (data) => {
      console.log("Player joined game:", data);
    });
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>KnightBoard ♟️</h2>
      <ChessGame />
    </div>
  );
}

export default App;
