import React, { useState } from "react";

const Question = ({ questionObject, onSave, onDelete }) => {
  if (!questionObject) {
    console.warn("Received undefined questionObject");
    return null;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [questionText, setQuestionText] = useState(questionObject.q || "");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onSave({ ...questionObject, q: questionText });
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    onDelete(questionObject);
  };

  return (
    <div className="d-flex justify-content-between align-items-center question">
      {isEditing ? (
        <input
          type="text"
          className="form-control flex-grow-1"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          onBlur={handleSaveClick}
          autoFocus
        />
      ) : (
        <div
          className="flex-grow-1"
          onClick={handleEditClick}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {questionText}
        </div>
      )}
      <button
        className="btn btn-danger btn-sm ms-1"
        onClick={handleDeleteClick}
      >
        <i className="bi bi-trash-fill"></i> X
      </button>
    </div>
  );
};

export default Question;
