import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AiOutlineFunction } from "react-icons/ai";
import { FaBook } from "react-icons/fa";
import { RiGalleryFill } from "react-icons/ri";
import { HiUsers } from "react-icons/hi";

import auth from "../../firebase/auth";
import { signOut } from "firebase/auth";

const Sidebar = (props) => {
  const navigate = useNavigate();
  const CerrarSesion = () => {
    signOut(auth).then(() => {
      navigate("/Login");
    });
  };
  const logoSrc = require("../../assets/img/logo.png");
  return (
    <>
      <div
        className="sidebar d-flex align-items-center justify-content-center flex-column"
        style={{
          transition: "all 0.5s ease",
        }}
      >
        <div className="d-flex align-items-center justify-content-center flex-column">
          <img
            src={logoSrc}
            alt="logo"
            width="60px"
            height="60px"
            style={{ cursor: "pointer", marginBottom: "8px" }}
            onClick={() => navigate("/")}
          />
          <span className="text-light">Administración</span>
        </div>
        <p className="text-light fw-bold">{props.usuario.nombre}</p>
        <ul>
          <li>
            <AiOutlineFunction className="text-light me-2 fs-4" />
            <Link to="/Estadisticas">Estadísticas</Link>
          </li>
          <li>
            <FaBook className="text-light me-2 fs-5" />
            <Link to="/Publicaciones">Publicaciones</Link>
          </li>
          <li>
            <RiGalleryFill className="text-light me-2 fs-5" />
            <Link to="/Galeria">Galería</Link>
          </li>
          <li>
            <HiUsers className="text-light me-2 fs-5" />
            <Link to="/Usuarios">Usuarios</Link>
          </li>
        </ul>
        <div>
          <button onClick={CerrarSesion} class="btn btn-outline-danger">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
