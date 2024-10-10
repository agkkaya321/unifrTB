import React, { useState, useEffect } from "react";
import Tableau from "./Tableau";

function DisplayGame({ phaseJeu, message, id }) {
  const [nbJoueurs, setNbJoueurs] = useState([]);
  const [question, setQuestion] = useState([]);
  const [display, setDisplay] = useState(false);
  const [stats, setStats] = useState([]);

  function extractLabelsAndScores(dataArray) {
    const labels = [];
    const scores = [];
    dataArray.forEach((item) => {
      labels.push(item.id);
      scores.push(item.score);
    });
    return {
      labels: labels,
      scores: scores,
    };
  }

  useEffect(() => {
    if (message.type === "nbJoueur") {
      const nouveauxJoueurs = message.content;
      setNbJoueurs(nouveauxJoueurs);
      if (message.content === null) {
        setNbJoueurs([]);
      }
    }

    if (message.type === "question") {
      console.log(message.content);
      setQuestion(message.content);
      console.log(question.pourqui);
      setDisplay(false);
    }
    if (message.type === "RepList") {
      setStats(JSON.parse(message.content));
      setDisplay(true);
    }
  }, [message]);

  return (
    <>
      {phaseJeu === 0 && (
        <div>
          <h1>Join: #{id}</h1>
          {nbJoueurs.length === 0 ? (
            <p>Waiting players...</p>
          ) : (
            <div>
              <ul>
                {nbJoueurs.map((joueur, index) => (
                  <li key={index}>{joueur}</li>
                ))}
              </ul>
            </div>
          )}
          <p>
            After clicking "Start," wait until everyone is ready, then answer
            the questions as if you were the given person
          </p>
        </div>
      )}
      {phaseJeu === 1 && (
        <div>
          {
            // peut etre animaux ici
          }
          <h1>Please answer questions...</h1>
        </div>
      )}
      {phaseJeu === 2 && (
        <div>
          {!display && (
            <>
              <div>Question: {question.question}</div>
              <div> Reponses: {question.reponse}</div>
            </>
          )}
          {display && (
            <>
              <div>Who: {question.qui}</div>
              <div>For Who: {question.pourqui}</div>
              {console.log(extractLabelsAndScores(stats))}
              <Tableau data={extractLabelsAndScores(stats)}></Tableau>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default DisplayGame;
