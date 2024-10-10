import React, { useState } from "react";
import QuizButton from "./quizSendButton";
import "./Quiz.css";

const Quiz = ({ nbJoueurs, setIsLoading, sendMessage }) => {
  const [selectedPlayer1, setSelectedPlayer1] = useState(nbJoueurs[0] || "");
  const [selectedPlayer2, setSelectedPlayer2] = useState(nbJoueurs[0] || "");

  const handlePlayer1Change = (direction) => {
    const currentIndex = nbJoueurs.indexOf(selectedPlayer1);
    const nextIndex =
      (currentIndex + direction + nbJoueurs.length) % nbJoueurs.length;
    setSelectedPlayer1(nbJoueurs[nextIndex]);
  };

  const handlePlayer2Change = (direction) => {
    const currentIndex = nbJoueurs.indexOf(selectedPlayer2);
    const nextIndex =
      (currentIndex + direction + nbJoueurs.length) % nbJoueurs.length;
    setSelectedPlayer2(nbJoueurs[nextIndex]);
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Quiz</h2>
      <div className="mb-3">
        <label htmlFor="player1" className="form-label">
          Who:{" "}
        </label>
        <div className="cs">
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => handlePlayer1Change(-1)}
          >
            &lt;
          </button>
          <span id="player1" className="form-control text-center">
            {selectedPlayer1}
          </span>
          <button
            className="btn btn-outline-primary ms-2"
            onClick={() => handlePlayer1Change(1)}
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="player2" className="form-label">
          For Who:{" "}
        </label>
        <div className="cs">
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => handlePlayer2Change(-1)}
          >
            &lt;
          </button>
          <span id="player2" className="form-control text-center">
            {selectedPlayer2}
          </span>
          <button
            className="btn btn-outline-primary ms-2"
            onClick={() => handlePlayer2Change(1)}
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="text-center mt-4">
        <QuizButton
          selectedPlayer1={selectedPlayer1}
          selectedPlayer2={selectedPlayer2}
          sendMessage={sendMessage}
          setIsLoading={setIsLoading}
        />
      </div>
    </div>
  );
};

export default Quiz;
