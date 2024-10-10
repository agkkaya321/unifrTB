import React, { useState } from "react";
import QCard from "./QCard";
import CreateCQ from "./CreateCQ";
import useQCards from "../../hooks/useQCard";

const Dashboard = ({ user, handleLogout }) => {
  const { data, error, handleRefresh } = useQCards();

  return (
    <div className="container">
      <div className="position-fixed top-0 end-0 m-3">
        <button
          className="btn btn-outline-secondary"
          id="logout"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right"></i> Logout
        </button>
      </div>

      <div className="text-center mt-5">
        <h1>Dashboard</h1>
        <p>Welcome, {user?.name}!</p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      )}

      <div
        className="row"
        style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
      >
        {data.map((qcard, index) => (
          <div className="col-md-4" key={qcard.id || index}>
            {" "}
            <QCard qcard={qcard} refresh={handleRefresh} />
          </div>
        ))}
      </div>

      <div className="col-md-12">
        <CreateCQ refresh={handleRefresh} />
      </div>
    </div>
  );
};

export default Dashboard;
