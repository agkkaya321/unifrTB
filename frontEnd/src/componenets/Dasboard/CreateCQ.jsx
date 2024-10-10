import React, { useState } from "react";
import { postCQ } from "../../hooks/QCardDB";

const CreateCQ = ({ refresh }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([""]);
  const [cards, setCards] = useState([]);

  const handleAddQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Le titre ne peut pas être vide.");
      return;
    }
    const hasNonEmptyQuestion = questions.some(
      (question) => question.trim() !== ""
    );
    if (!hasNonEmptyQuestion) {
      alert("Il doit y avoir au moins une question non vide.");
      return;
    }
    const cardData = {
      title,
      questions,
    };

    setCards([...cards, cardData]);
    setIsCreating(false);
    setTitle("");
    setQuestions([""]);
    const response = await postCQ(cardData);
    if (response) {
      refresh();
    }
  };

  return (
    <div className="create-cq container mt-4">
      {!isCreating ? (
        <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
          Create
        </button>
      ) : (
        <div>
          <div className="mb-3">
            <label className="form-label">Titre:</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          {questions.map((question, index) => (
            <div className="mb-3" key={index}>
              <label className="form-label">Question:</label>
              <input
                type="text"
                className="form-control"
                value={question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
              />
            </div>
          ))}
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-secondary"
              onClick={() => setIsCreating(false)}
            >
              Réduire
            </button>
            <button className="btn btn-warning" onClick={handleAddQuestion}>
              Ajouter une question
            </button>
            <button className="btn btn-success" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCQ;
