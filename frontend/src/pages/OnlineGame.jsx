import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import socket from "../socket";

function OnlineGame() {
  const [fen, setFen] = useState("start");
  const [color, setColor] = useState(null);
  const [turn, setTurn] = useState(null);

  useEffect(() => {
    socket.on("color", setColor);
    socket.on("game_state", ({ fen, turn }) => {
      setFen(fen);
      setTurn(turn);
    });

    socket.emit("findMatch");

    return () => {
      socket.off("color");
      socket.off("game_state");
    };
  }, []);

  return (
    <Chessboard
      position={fen}
      boardOrientation={color === "b" ? "black" : "white"}
      isDraggablePiece={({ piece }) =>
        piece && piece[0] === color && turn === color
      }
      onPieceDrop={(from, to) => {
        socket.emit("move", { from, to });
        return true;
      }}
    />
  );
}

export default OnlineGame;
