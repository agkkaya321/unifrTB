import React, { useEffect, useState } from "react";
import formatMessage from "../../hooks/messageFormtter";

const StartButton = ({ sendMessage }) => {
  const [isActive, setIsActive] = useState(false);

  const toggleButton = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const message = formatMessage("starter", isActive.toString()); // Appel du hook useFM
    sendMessage(message); // Appel de la fonction sendMessage si nécessaire
  }, [isActive]); // Ajout de sendMessage dans les dépendances

  const buttonStyle = {
    backgroundColor: isActive ? "green" : "transparent",
    border: "1px solid green",
    color: isActive ? "white" : "green",
    padding: "10px 20px",
    cursor: "pointer",
  };

  return (
    <button style={buttonStyle} onClick={toggleButton}>
      Start
    </button>
  );
};

export default StartButton;
