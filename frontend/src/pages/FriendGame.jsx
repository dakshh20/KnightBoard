import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import socket from "../socket";

function FriendGame() {
  const [fen, setFen] = useState("start");
  const [color, setColor] = useState(null);
  const [turn, setTurn] = useState(null);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    socket.on("roomCreated", setRoom);
    socket.on("color", setColor);
    socket.on("game_state", ({ fen, turn }) => {
      setFen(fen);
      setTurn(turn);
    });

    return () => {
      socket.off("roomCreated");
      socket.off("color");
      socket.off("game_state");
    };
  }, []);

  return (
    <div>
      {!room && (
        <>
          <button onClick={() => socket.emit("createGame")}>Create</button>
          <button
            onClick={() =>
              socket.emit("joinGame", {
                gameId: prompt("Enter room id"),
              })
            }
          >
            Join
          </button>
        </>
      )}

      <Chessboard
        position={fen}
        boardOrientation={color === "b" ? "black" : "white"}
        isDraggablePiece={({ piece }) =>
          piece && piece[0] === color && turn === color
        }
        onPieceDrop={(from, to) => {
          socket.emit("move", { gameId: room, from, to });
          return true;
        }}
      />

      {room && <p>Room ID: {room}</p>}
    </div>
  );
}

export default FriendGame;
