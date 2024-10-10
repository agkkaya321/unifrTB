import React, { useState, useEffect } from "react";
import useWebSocket from "../../hooks/useWebSocket";
import FormDisplay from "./FormDIsplay";
import DisplayGame from "./DisplayGame";
import formatMessage from "../../hooks/messageFormtter";

function Displayer() {
  const [formData, setFormData] = useState(null);
  const { message, sendMessage, setUrl } = useWebSocket();
  const [phaseJeu, setPhase] = useState(-1);
  const [tableID, setTableID] = useState();

  useEffect(() => {
    if (formData) {
      const { tableId } = formData;
      setUrl(`ws://localhost:8080?table=${tableId}&displayView=true`);
      setTableID(tableId);
    }
  }, [formData, setUrl]);

  // Il faut mettre la les changements pour les différents message reçu  !!!!!!!
  useEffect(() => {
    console.log("message: " + message);
    if (message.type === "nbJoueur") {
      if (phaseJeu < 0) {
        setPhase(0);
      }
    }
    if (message.type === "changePhase") {
      setPhase(parseInt(message.content));
    }

    if (message.type === "end") {
      setPhase(-1);
    }

    if (message.type === "RepList") {
      setTimeout(() => {
        sendMessage(formatMessage("DVOK", "true"));
      }, 15000); // TIMEOUT
    }
  }, [message]);

  const handleFormSubmit = (submittedData) => {
    setFormData(submittedData);
  };

  return (
    <>
      {phaseJeu >= 0 ? (
        <DisplayGame phaseJeu={phaseJeu} message={message} id={tableID} />
      ) : (
        <FormDisplay onSubmit={handleFormSubmit} />
      )}
    </>
  );
}

export default Displayer;
