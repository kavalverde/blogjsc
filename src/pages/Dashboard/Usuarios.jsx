/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import { FaEdit } from "react-icons/fa";

import db from "../../firebase/firestore";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

const Usuarios = (props) => {
  const [usuarios, setUsuarios] = useState(null);
  const [loading, setLoading] = useState(true);

  const obtenerUsuarios = async () => {
    const { docs } = await getDocs(collection(db, "users"));
    const arreglo = docs.map((item) => ({ id: item.id, ...item.data() }));
    setUsuarios(arreglo);
  };

  //Borrar imagen
  const handleEdit = async (id) => {
    Swal.fire({
      title: "Ingresa un nuevo nombre",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Continuar",
      showLoaderOnConfirm: true,
      preConfirm: async (login) => {
        const docRef = doc(db, "users", id);
        const data = {
          nombre: login,
        };
        await updateDoc(docRef, data);
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: `Nombre de usuario actualizado`,
        });
      }
      obtenerUsuarios();
    });
  };

  useEffect(() => {
    obtenerUsuarios();
    setLoading(false);
  }, []);

  return (
    <>
      {loading === false && props.usuario.tipo === "administrador" ? (
        <div
          className="container-fluid"
          style={{
            backgroundColor: "#F7F8FC",
            width: "88%",
            minHeight: "100vh",
          }}
        >
          <div>
            <h3 className="mt-2">Usuarios</h3>
            <div
              className="p-3 border border border-1"
              style={{ backgroundColor: "white" }}
            >
              <div className="d-flex justify-content-between row">
                <p className="fw-bold fs-6 col-12 col-md-4">
                  Todas los usuarios
                </p>
                <Link
                  className="btn btn-primary col-12 col-md-4"
                  to="/Nuevo-Usuario"
                >
                  Agregar nuevo usuario
                </Link>
              </div>
              <div className="table-responsive">
                <table class="table table-striped table-hover mt-3">
                  <thead className="table-dark">
                    <tr className="fs-6">
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios
                      ? usuarios.map((user) => (
                          <tr className="fs-6">
                            <td>
                              {user.nombre}
                              <div className="fw-bold">
                                {user.nombre === props.usuario.nombre ? (
                                  <span>Tu usuario</span>
                                ) : null}
                              </div>
                            </td>
                            <td>{user.correo}</td>
                            {props.usuario.SA === true ? (
                              <td className="text-center">
                                <a
                                  href="#"
                                  onClick={() => {
                                    handleEdit(user.id);
                                  }}
                                >
                                  <FaEdit className="text-dark fs-3" />
                                </a>
                              </td>
                            ) : null}
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Usuarios;
