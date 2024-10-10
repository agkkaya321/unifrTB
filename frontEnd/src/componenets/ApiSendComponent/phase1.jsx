import React, { useState, useEffect } from "react";
import formatMessage from "../../hooks/messageFormtter";

const QCard = ({ questions, nbJoueurs, sendMessage, setIsloading }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [jsonData, setJsonData] = useState([]);
  const [randomIndex, setRandomIndex] = useState(getRandomIndex(nbJoueurs));

  useEffect(() => {
    setRandomIndex(getRandomIndex(nbJoueurs));
  }, [currentQuestionIndex]);

  function getRandomIndex(nbj) {
    const randomIndex = Math.floor(Math.random() * nbj.length);
    return randomIndex;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      question: questions[currentQuestionIndex],
      pourqui: nbJoueurs[randomIndex],
      reponse: answer,
      qui: "",
    };

    const updatedJsonData = [...jsonData, newEntry];

    if (currentQuestionIndex < questions.length - 1) {
      setJsonData(updatedJsonData);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer("");
    } else {
      console.log(updatedJsonData);
      sendMessage(formatMessage("data", JSON.stringify(updatedJsonData)));
      setIsloading(true);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h2 className="my-4 text-center">
            Question {currentQuestionIndex + 1} / {questions.length} answer like{" "}
            <span className="text-danger">{nbJoueurs[randomIndex]}</span>
          </h2>
          <p className="lead text-center">{questions[currentQuestionIndex]}</p>
          <form
            onSubmit={handleSubmit}
            className="d-flex flex-column align-items-center"
          >
            <div className="form-group w-100">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here"
                className="form-control mb-3"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QCard;
