import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import UseAuth from "./hooks/UseAuth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Album from "./pages/Album";
import { GiHamburgerMenu } from "react-icons/gi";

//import Dashboard from "./pages/Dashboard";

import Sidebar from "./components/ui/Sidebar";
import LoadingPage from "./components/LoadingPage";

import Publicaciones from "./pages/Dashboard/Publicaciones";
import NuevaPublicacion from "./pages/Dashboard/NuevaPublicacion";
import EditarPublicacion from "./pages/Dashboard/EditarPublicacion";
import Galeria from "./pages/Dashboard/Galeria";
import NuevaImagen from "./pages/Dashboard/NuevaImagen";
import EditarImagen from "./pages/Dashboard/EditarImagen";
import Usuarios from "./pages/Dashboard/Usuarios";
import NuevoUsuario from "./pages/Dashboard/NuevoUsuario";
import Estadisticas from "./pages/Dashboard/Estadisticas";
import Encuesta from "./pages/Dashboard/Encuesta";

const App = () => {
  const { loading, usuario, datos } = UseAuth();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Album" element={<Album />} />
        {/* Rutas de publicaciones */}
        <Route
          path="/Publicaciones"
          element={
            <>
              {loading === false && usuario && datos ? (
                <div className="d-flex" style={{ backgroundColor: "#F7F8FC" }}>
                  {isOpen ? (
                    <div>
                      <div
                        className="ms-2"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          cursor: "pointer",
                        }}
                      >
                        <GiHamburgerMenu
                          className="text-light"
                          style={{ fontSize: "2rem" }}
                          onClick={() => {
                            setIsOpen(false);
                          }}
                        />
                      </div>
                      <Sidebar usuario={datos} />
                    </div>
                  ) : (
                    <div style={{ backgroundColor: "#F7F8FC" }}>
                      <div
                        className="p-1 rounded-circle border"
                        style={{
                          backgroundColor: "#212529",
                          cursor: "pointer",
                          transition: "all 0.5s ease",
                        }}
                      >
                        <GiHamburgerMenu
                          className="text-white fs-3"
                          onClick={() => {
                            setIsOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="w-100" onClick={() => setIsOpen(false)}>
                    <Publicaciones usuario={datos} />
                  </div>
                </div>
              ) : (
                <div>
                  <LoadingPage />
                </div>
              )}
            </>
          }
        />
        <Route
          path="/Nueva-Publicacion"
          element={
            <>
              {loading === false && usuario && datos ? (
                <div className="d-flex">
                  {isOpen ? (
                    <div>
                      <div
                        className="ms-2"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          cursor: "pointer",
                        }}
                      >
                        <GiHamburgerMenu
                          className="text-light"
                          style={{ fontSize: "2rem" }}
                          onClick={() => {
                            setIsOpen(false);
                          }}
                        />
                      </div>
                      <Sidebar usuario={datos} />
                    </div>
                  ) : (
                    <div style={{ backgroundColor: "#F7F8FC" }}>
                      <div
                        className="p-1 rounded-circle border"
                        style={{
                          backgroundColor: "#212529",
                          cursor: "pointer",
                          transition: "all 0.5s ease",
                        }}
                      >
                        <GiHamburgerMenu
                          className="text-white fs-3"
                          onClick={() => {
                            setIsOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="w-100" onClick={() => setIsOpen(false)}>
                    <NuevaPublicacion usuario={datos} />
                  </div>
                </div>
              ) : (
                <div>
                  <LoadingPage />
                </div>
              )}
            </>
          }
        />
        <Route
          path="/Editar-Publicacion/:id"
          element={
            <>
              {loading === false && usuario && datos ? (
                <div className="d-flex">
                  {isOpen ? (
                    <div>
                      <div
                        className="ms-2"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          cursor: "pointer",
                        }}
                      >
                        <GiHamburgerMenu
                          className="text-light"
                          style={{ fontSize: "2rem" }}
                          onClick={() => {
                            setIsOpen(false);
                          }}
                        />
                      </div>
                      <Sidebar usuario={datos} />
                    </div>
                  ) : (
                    <div style={{ backgroundColor: "#F7F8FC" }}>
                      <div
                        className="p-1 rounded-circle border"
                        style={{
                          backgroundColor: "#212529",
                          cursor: "pointer",
                          transition: "all 0.5s ease",
                        }}
                      >
                        <GiHamburgerMenu
                          className="text-white fs-3"
                          onClick={() => {
                            setIsOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="w-100" onClick={() => setIsOpen(false)}>
                    <EditarPublicacion usuario={datos} />
                  </div>
                </div>
              ) : (
                <div>
                  <LoadingPage />
                </div>
              )}
            </>
          }
        />
        {/* Rutas de Galería */}
        <Route
          path="/Galeria"
          element={
            <>
              {loading === false && usuario && datos ? (
                <div className="d-flex" style={{ backgroundColor: "#F7F8FC" }}>
                  {isOpen ? (
                    <div>
                      <div
                        className="ms-2"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          cursor: "pointer",
                        }}
                      >
                        <GiHamburgerMenu
                          className="text-light"
                          style={{ fontSize: "2rem" }}
                          onClick={() => {
                            setIsOpen(false);
                          }}
                        />
                      </div>
                      <Sidebar usuario={datos} />
                    </div>
                  ) : (
                    <div style={{ backgroundColor: "#F7F8FC" }}>
                      <div
                        className="p-1 rounded-circle border"
                        style={{
                          backgroundColor: "#212529",
                          cursor: "pointer",
                          transition: "all 0.5s ease",
                        }}
                      >
                        <GiHamburgerMenu
                          className="text-white fs-3"
                          onClick={() => {
                            setIsOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="w-100" onClick={() => setIsOpen(false)}>
                    <Galeria usuario={datos} />
                  </div>
                </div>
              ) : (
                <div>
                  <LoadingPage />
                </div>
              )}
            </>
          }
        />
        <Route
          path="/Nueva-Imagen"
          element={
            <>
              {loading === false && usuario && datos ? (
                <div className="d-flex">
                  {isOpen ? (
                    <div>
                      <div
                        className="ms-2"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          cursor: "pointer",
                        }}
                      >
                        <GiHamburgerMenu
                          className="text-light"
                          style={{ fontSize: "2rem" }}
                          onClick={() => {
                            setIsOpen(false);
                          }}
                        />
                      </div>
                      <Sidebar usuario={datos} />
                    </div>
                  ) : (
                    <div style={{ backgroundColor: "#F7F8FC" }}>
                      <div
                        className="p-1 rounded-circle border"
                        style={{
                          backgroundColor: "#212529",
                          cursor: "pointer",
                          transition: "all 0.5s ease",
                        }}
                      >
                        <GiHamburgerMenu
                          className="text-white fs-3"
                          onClick={() => {
                            setIsOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="w-100" onClick={() => setIsOpen(false)}>
                    <NuevaImagen usuario={datos} />
                  </div>
                </div>
              ) : (
                <div>
                  <LoadingPage />
                </div>
              )}
            </>
          }
        />
        <Route
          path="/Editar-Imagen/:id"
          element={
            <>
              {loading === false && usuario && datos ? (
                <div className="d-flex">
                  {isOpen ? (
                    <div>
                      <div
                        className="ms-2"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          cursor: "pointer",
                        }}
                      >
                        <GiHamburgerMenu
                          className="text-light"
                          style={{ fontSize: "2rem" }}
                          onClick={() => {
                            setIsOpen(false);
                          }}
                        />
                      </div>
                      <Sidebar usuario={datos} />
                    </div>
                  ) : (
                    <div style={{ backgroundColor: "#F7F8FC" }}>
                      <div
                        className="p-1 rounded-circle border"
                        style={{
                          backgroundColor: "#212529",
                          cursor: "pointer",
                          transition: "all 0.5s ease",
                        }}
                      >
                        <GiHamburgerMenu
                          className="text-white fs-3"
                          onClick={() => {
                            setIsOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="w-100" onClick={() => setIsOpen(false)}>
                    <EditarImagen usuario={datos} />
                  </div>
                </div>
              ) : (
                <div>
                  <LoadingPage />
                </div>
              )}
            </>
          }
        />
        {/* Rutas para usuario */}
        <Route
          path="/Usuarios"
          element={
            <>
              {loading === false && usuario && datos ? (
                <div className="d-flex" style={{ backgroundColor: "#F7F8FC" }}>
                  {isOpen ? (
                    <div>
                      <div
                        className="ms-2"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          cursor: "pointer",
                        }}
                      >
                        <GiHamburgerMenu
                          className="text-light"
                          style={{ fontSize: "2rem" }}
                          onClick={() => {
                            setIsOpen(false);
                          }}
                        />
                      </div>
                      <Sidebar usuario={datos} />
                    </div>
                  ) : (
                    <div style={{ backgroundColor: "#F7F8FC" }}>
                      <div
                        className="p-1 rounded-circle border"
                        style={{
                          backgroundColor: "#212529",
                          cursor: "pointer",
                          transition: "all 0.5s ease",
                        }}
                      >
                        <GiHamburgerMenu
                          className="text-white fs-3"
                          onClick={() => {
                            setIsOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="w-100" onClick={() => setIsOpen(false)}>
                    <Usuarios usuario={datos} />
                  </div>
                </div>
              ) : (
                <div>
                  <LoadingPage />
                </div>
              )}
            </>
          }
        />
        <Route
          path="/Nuevo-Usuario"
          element={
            <>
              {loading === false && usuario && datos ? (
                <div className="d-flex">
                  {isOpen ? (
                    <div>
                      <div
                        className="ms-2"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          cursor: "pointer",
                        }}
                      >
                        <GiHamburgerMenu
                          className="text-light"
                          style={{ fontSize: "2rem" }}
                          onClick={() => {
                            setIsOpen(false);
                          }}
                        />
                      </div>
                      <Sidebar usuario={datos} />
                    </div>
                  ) : (
                    <div style={{ backgroundColor: "#F7F8FC" }}>
                      <div
                        className="p-1 rounded-circle border"
                        style={{
                          backgroundColor: "#212529",
                          cursor: "pointer",
                          transition: "all 0.5s ease",
                        }}
                      >
                        <GiHamburgerMenu
                          className="text-white fs-3"
                          onClick={() => {
                            setIsOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="w-100" onClick={() => setIsOpen(false)}>
                    <NuevoUsuario usuario={datos} />
                  </div>
                </div>
              ) : (
                <div>
                  <LoadingPage />
                </div>
              )}
            </>
          }
        />
        {/* Encuestas y Estadísticas */}
        <Route
          path="/Estadisticas"
          element={
            <>
              {loading === false && usuario && datos ? (
                <div className="d-flex" style={{ backgroundColor: "#F7F8FC" }}>
                  {isOpen ? (
                    <div>
                      <div
                        className="ms-2"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          cursor: "pointer",
                        }}
                      >
                        <GiHamburgerMenu
                          className="text-light"
                          style={{ fontSize: "2rem" }}
                          onClick={() => {
                            setIsOpen(false);
                          }}
                        />
                      </div>
                      <Sidebar usuario={datos} />
                    </div>
                  ) : (
                    <div style={{ backgroundColor: "#F7F8FC" }}>
                      <div
                        className="p-1 rounded-circle border"
                        style={{
                          backgroundColor: "#212529",
                          cursor: "pointer",
                          transition: "all 0.5s ease",
                        }}
                      >
                        <GiHamburgerMenu
                          className="text-white fs-3"
                          onClick={() => {
                            setIsOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="w-100" onClick={() => setIsOpen(false)}>
                    <Estadisticas usuario={datos} />
                  </div>
                </div>
              ) : (
                <div>
                  <LoadingPage />
                </div>
              )}
            </>
          }
        />
        <Route
          path="/Encuesta"
          element={
            <>
              {loading === false && usuario && datos ? (
                <div className="d-flex">
                  {isOpen ? (
                    <div>
                      <div
                        className="ms-2"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          cursor: "pointer",
                        }}
                      >
                        <GiHamburgerMenu
                          className="text-light"
                          style={{ fontSize: "2rem" }}
                          onClick={() => {
                            setIsOpen(false);
                          }}
                        />
                      </div>
                      <Sidebar usuario={datos} />
                    </div>
                  ) : (
                    <div style={{ backgroundColor: "#F7F8FC" }}>
                      <div
                        className="p-1 rounded-circle border"
                        style={{
                          backgroundColor: "#212529",
                          cursor: "pointer",
                          transition: "all 0.5s ease",
                        }}
                      >
                        <GiHamburgerMenu
                          className="text-white fs-3"
                          onClick={() => {
                            setIsOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="w-100" onClick={() => setIsOpen(false)}>
                    <Encuesta usuario={datos} />
                  </div>
                </div>
              ) : (
                <div>
                  <LoadingPage />
                </div>
              )}
            </>
          }
        />
      </Routes>
    </>
  );
};

export default App;
