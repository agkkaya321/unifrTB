import React from "react";

const Tableau = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {data.labels.map((label, index) => (
          <tr key={index}>
            <td>{label}</td>
            <td>{data.scores[index]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Tableau;
