import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChessGame from "./components/ChessGame";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play-online" element={<ChessGame mode="online" />} />
        <Route path="/play-friend" element={<ChessGame mode="friend" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
