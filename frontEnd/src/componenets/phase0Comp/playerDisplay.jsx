import React from "react";

const PlayerDisplay = ({ nbJoueurs }) => {
  return (
    <div>
      <ul>
        {nbJoueurs.map((joueur, index) => (
          <li key={index}>{joueur}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerDisplay;
