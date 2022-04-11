import React, { useState, useEffect } from "react";
import UseAuth from "../hooks/UseAuth";

const Dashboard = () => {
  const { loading, usuario } = UseAuth();
  return (
    <div>
      <h3>Dashboard</h3>
      {loading ? (
        <>cargando información...</>
      ) : (
        <div>
          {usuario.email}
          <div></div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
