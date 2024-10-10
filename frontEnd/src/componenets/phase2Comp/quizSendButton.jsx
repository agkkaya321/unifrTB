import React from "react";
import formatMessage from "../../hooks/messageFormtter";

const QuizButton = ({
  selectedPlayer1,
  selectedPlayer2,
  sendMessage,
  setIsLoading,
}) => {
  const message = formatMessage(
    "reponseQuiz",
    [selectedPlayer1, selectedPlayer2].toString()
  );

  const handleClick = () => {
    sendMessage(message);
    setIsLoading(true);
  };

  return (
    <button className="btn btn-primary btn-lg w-100" onClick={handleClick}>
      Send Message
    </button>
  );
};

export default QuizButton;
