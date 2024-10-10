import React, { useState, useEffect } from "react";
import FormJeu from "./FormJeu";
import Game from "./Game";
import useWebSocket from "../../hooks/useWebSocket";

function Jeu() {
  const [sessionJeu, setSessionJeu] = useState(false);
  const [formData, setFormData] = useState(null);

  const { message, sendMessage, setUrl } = useWebSocket();

  useEffect(() => {
    if (formData) {
      const { name, tableId } = formData;
      setUrl(`ws://localhost:8080?id=${name}&table=${tableId}`); // à modifier ip ici pour lancement de jeu local
    }
  }, [formData, setUrl]);

  const handleFormSubmit = (formData) => {
    setFormData(formData);
  };

  useEffect(() => {
    console.log(message);
    if (message && sessionJeu != true) {
      setSessionJeu(true);
    }

    if (message.type == "end") {
      setSessionJeu(false);
    }
  }, [message]);

  return (
    <>
      {sessionJeu ? (
        <Game message={message} sendMessage={sendMessage} />
      ) : (
        <FormJeu onSubmit={handleFormSubmit} />
      )}
    </>
  );
}

export default Jeu;
