import React from "react";
import { useNavigate } from "react-router-dom";

import { FiLogIn } from "react-icons/fi";

import auth from "../firebase/auth";
import { signOut } from "firebase/auth";

const LoadingPage = () => {
  const navigate = useNavigate();
  const handleSignOut = async () => {
    signOut(auth).then(() => {
      navigate("/Login");
    });
  };

  return (
    <div className="container">
      <div
        className="d-flex justify-content-center align-items-center flex-column"
        style={{ height: "100vh" }}
      >
        <p
          className="text-center my-5"
          style={{ fontSize: "6vh", textShadow: "0.1em 0.1em 0.4em black" }}
        >
          Estamos cargando tus datos. Si el proceso no funciona, prueba ingresar
          a tu cuenta de nuevo
        </p>
        <div
          onClick={() => handleSignOut()}
          className="border rounded-circle border-5 p-3 bg-info border-secondary"
          style={{ boxShadow: "0.5vh 0.5vh 0.5vh black", cursor: "pointer" }}
        >
          <FiLogIn className="text-light" style={{ fontSize: "10vh" }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
