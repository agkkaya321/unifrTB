import React, { useState } from "react";
import Question from "./Question";
import "./css/QCard.css";
import {
  deleteQCardDB,
  deleteQuestion,
  insertQuestions,
  changeTitle,
  changeQ,
  startNewTable,
} from "../../hooks/QCardDB";

const QCard = ({ qcard, refresh }) => {
  const card = qcard.card;
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState(qcard.card.nom);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [questions, setQuestions] = useState(qcard.questions);
  const [newQuestions, setNewQuestions] = useState([]);
  const [displaying, setDisplaying] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = async () => {
    setIsEditingTitle(false);
    try {
      await changeTitle(title, card.id);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleSave = (questionObject) => {
    console.log("Save: ", questionObject);
    changeQ(questionObject.id, questionObject.q);
  };

  const handleDeleteQ = async (questionToDelete) => {
    try {
      console.log("Deleted: ", questionToDelete);
      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question.id !== questionToDelete.id)
      );

      const response = await deleteQuestion(questionToDelete.id);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleAddNewQuestionField = () => {
    setNewQuestions((prevNewQuestions) => {
      if (
        prevNewQuestions.length === 0 ||
        prevNewQuestions[prevNewQuestions.length - 1].trim() !== ""
      ) {
        return [...prevNewQuestions, ""];
      }
      return prevNewQuestions;
    });
  };

  const handleNewQuestionChange = (index, value) => {
    const updatedNewQuestions = newQuestions.map((q, i) =>
      i === index ? value : q
    );
    setNewQuestions(updatedNewQuestions);
  };

  const handleSaveNewQuestions = async () => {
    const nonEmptyQuestions = newQuestions.filter((q) => q.trim() !== "");
    try {
      const response = await insertQuestions(card.id, nonEmptyQuestions);
      if (response) {
        console.log("Response received:", response);
        setNewQuestions([]);
        console.log(qcard);
      } else {
        console.warn("No response data received.");
      }
    } catch (error) {
      console.error("Error saving new questions:", error);
    }
  };

  const deleteQCard = async () => {
    setDisplaying(true);
    try {
      const response = await deleteQCardDB(card);
    } catch (error) {
      console.error("Error deleting QCard:", error);
    } finally {
    }
  };

  const handleStart = async () => {
    const tableID = await startNewTable(card.id);
  };

  return (
    !displaying && (
      <div className="card p-3 qcard" id="qcard">
        {isEditingTitle ? (
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            autoFocus
          />
        ) : (
          <h2
            className="card-title"
            onClick={handleTitleClick}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "15px",
            }}
          >
            {title}
          </h2>
        )}
        <div className="d-flex justify-content-center">
          <button className="btn btn-primary me-2" onClick={handleStart}>
            Start
          </button>
          <button className="btn btn-secondary me-2" onClick={handleToggle}>
            {isExpanded ? "Close" : "Open"}
          </button>
          <button className="btn btn-danger" onClick={deleteQCard}>
            Delete
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3">
            {questions && questions.length > 0 ? (
              questions.map((question, index) => (
                <Question
                  key={question.id || index}
                  questionObject={question}
                  onSave={handleSave}
                  onDelete={() => handleDeleteQ(question)}
                />
              ))
            ) : (
              <div>No questions available</div>
            )}
            {newQuestions.map((question, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={question}
                  onChange={(e) =>
                    handleNewQuestionChange(index, e.target.value)
                  }
                  placeholder="Enter new question"
                />
              </div>
            ))}
            <button
              className="btn btn-outline-primary me-2"
              onClick={handleAddNewQuestionField}
            >
              Add new question
            </button>
            <button
              className="btn btn-success"
              onClick={handleSaveNewQuestions}
            >
              Save
            </button>
          </div>
        )}
      </div>
    )
  );
};

export default QCard;
