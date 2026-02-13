import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h1>♟ KnightBoard</h1>
      <p>Play chess online or with friends</p>

      <div style={{ marginTop: 40 }}>
        <button
          style={{ padding: "10px 20px", marginRight: 10 }}
          onClick={() => navigate("/play-online")}
        >
          Play Online
        </button>

        <button
          style={{ padding: "10px 20px" }}
          onClick={() => navigate("/play-friend")}
        >
          Play with Friend
        </button>
      </div>
    </div>
  );
}

export default Home;
