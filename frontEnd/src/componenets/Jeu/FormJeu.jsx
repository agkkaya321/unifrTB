import React, { useState } from "react";

const FormJeu = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [tableId, setTableId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, tableId });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <h1 className="text-center mb-4">Join a Game</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="tableId" className="form-label">
                Table ID
              </label>
              <input
                type="text"
                className="form-control"
                id="tableId"
                placeholder="Table ID"
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
                required
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

export default FormJeu;
