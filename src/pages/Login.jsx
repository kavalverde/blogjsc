import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import auth from "../firebase/auth";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../themes/Login.css";

const Login = () => {
  const logoSrc = require("../assets/img/logo.png");
  const logoGoogle = require("../assets/img/google.png");

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msgerror, setMsgerror] = useState(null);

  const provider = new GoogleAuthProvider();

  const LoginUsuario = (e) => {
    e.preventDefault();
    console.log(email, pass);
    if (email === "" || pass === "") {
      setMsgerror("Todos los campos son obligatorios");
    } else {
      signInWithEmailAndPassword(auth, email, pass)
        .catch((error) => {
          if (error.code === "auth/wrong-password") {
            setMsgerror("La contraseña no coincide con el usuario");
          }
          if (error.code === "auth/user-not-found") {
            setMsgerror("Usuario no encontrado");
          }
          console.log(error);
        })
        .then((r) => {
          navigate("/Publicaciones");
        });
    }
  };
  const LoginGoogle = async () => {
    await signInWithPopup(auth, provider).then((r) => {
      navigate("/Publicaciones");
    });
  };
  const redireccionar = async () => {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/Publicaciones");
      }
    });
  };
  useEffect(() => {
    redireccionar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="login-page d-flex justify-content-center align-items-center">
      <div className="container bg-white w-75 rounded">
        <div className="d-flex justify-content-center mt-4">
          <img src={logoSrc} alt="logo" width="100px" height="100px" />
        </div>
        <p className="text-center fs-3 fw-bold">Bienvenido de nuevo</p>
        <p className="texto text-center fs-5">Por favor ingrese sus datos</p>
        <form className="mx-5" onSubmit={LoginUsuario}>
          <label className="form-label fw-bold">Correo electrónico: </label>
          <input
            type="email"
            id="input-email"
            className="form-control"
            aria-describedby="passwordHelpBlock"
            placeholder="Ingrese su correo electrónico"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <label className="form-label mt-3 fw-bold">Contraseña: </label>
          <input
            type="password"
            id="input-password"
            className="form-control"
            aria-describedby="passwordHelpBlock"
            placeholder="Ingrese su contraseña"
            onChange={(e) => {
              setPass(e.target.value);
            }}
          />
          <div className="d-flex justify-content-center">
            <input
              type="submit"
              className="btn btn-primary mt-3 px-5 py-2"
              value="Ingresar a tu cuenta"
            />
          </div>
        </form>
        {msgerror != null ? (
          <div className="alert alert-danger mt-3">{msgerror}</div>
        ) : (
          <span></span>
        )}
        <div className="d-flex justify-content-center mb-3">
          <button
            type="button"
            className="btn btn-dark px-3 py-2 mt-3 "
            onClick={() => {
              LoginGoogle();
            }}
          >
            <img
              src={logoGoogle}
              alt="logo"
              width="25px"
              height="25px"
              className="me-2"
            />
            Ingresar con tu cuenta de Google
          </button>
        </div>
        <Link to="/" className="text-muted">
          <p className="text-end fs-5">Volver a Inicio</p>
        </Link>
      </div>
    </div>
  );
};

export default Login;
