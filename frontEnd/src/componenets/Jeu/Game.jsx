import React, { useEffect, useState } from "react";
import StartButton from "../ApiSendComponent/StarterButton";
import QCard from "../ApiSendComponent/phase1";
import Loading from "../Loading/load";
import PlayerDisplay from "../phase0Comp/playerDisplay";
import Quiz from "../phase2Comp/quiz";

function Game({ message, sendMessage }) {
  const [phaseJeu, setPhase] = useState(0);
  const [nbJoueurs, setNbJoueurs] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle and interpret message
  useEffect(() => {
    switch (message.type) {
      case "nbJoueur":
        setNbJoueurs(message.content || []);
        break;
      case "questionsRound":
        setQuestions(message.content);
        break;
      case "changePhase":
        setPhase(message.content);
        if (message.content != phaseJeu) {
          setIsLoading(false);
          setPhase(message.content);
        }
        break;
      case "question":
        setIsLoading(false);
      default:
        break;
    }
  }, [message]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {phaseJeu == 0 && (
            <div>
              {nbJoueurs.length === 0 ? (
                <p>Waiting players...</p>
              ) : (
                <PlayerDisplay nbJoueurs={nbJoueurs} />
              )}
              <StartButton sendMessage={sendMessage} />
            </div>
          )}
          {phaseJeu == 1 && (
            <QCard
              questions={questions}
              nbJoueurs={nbJoueurs}
              sendMessage={sendMessage}
              setIsloading={setIsLoading}
            />
          )}
          {phaseJeu == 2 && (
            <Quiz
              nbJoueurs={nbJoueurs}
              setIsLoading={setIsLoading}
              sendMessage={sendMessage}
            />
          )}
        </>
      )}
    </>
  );
}

export default Game;
