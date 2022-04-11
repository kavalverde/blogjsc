/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";

import db from "../../firebase/firestore";
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  orderBy,
  limit,
  startAfter,
  query,
} from "firebase/firestore";

import storage from "../../firebase/firestorage";
import { ref, deleteObject } from "firebase/storage";

const Publicaciones = (props) => {
  const [publicaciones, setPublicaciones] = useState(null);
  const [loading, setLoading] = useState(true);
  const [primero, setPrimero] = useState(null);
  const [ultimo, setUltimo] = useState(null);
  const [desactivarSiguiente, setDesactivarSiguiente] = useState(false);
  const [desactivarAnterior, setDesactivarAnterior] = useState(true);
  const [contador, setContador] = useState(1);

  //Funcion para obtener las entradas de la base de datos
  const obtenerPublicaciones = async () => {
    const publicacionesRef = collection(db, "publicaciones");
    const q = query(publicacionesRef, orderBy("date", "desc"), limit(8));
    const { docs } = await getDocs(q);
    const data = await getDocs(q);
    setPrimero(data.docs[0]);
    setUltimo(data.docs[data.docs.length - 1]);
    const arreglo = docs.map((item) => ({ id: item.id, ...item.data() }));
    setPublicaciones(arreglo);
  };
  //Funcion borrar publicaciones
  const handleDeletePublicacion = async (
    id,
    idContenido,
    principalReferencia,
    imagenes
  ) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir los cambios!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, borrarlo!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        //Borrar imagen principal
        try {
          const desertRef = await ref(storage, principalReferencia);
          await deleteObject(desertRef).then(console.log("borrado"));
        } catch (error) {
          console.log(error);
        }
        try {
          imagenes.forEach(async (imagen) => {
            console.log(imagen.referencia);
            await deleteObject(ref(storage, imagen.referencia)).then(
              console.log("borrado")
            );
          });
        } catch (error) {
          console.log(error);
        }
        console.log(id);
        await deleteDoc(doc(db, "publicaciones", id));
        Swal.fire("Borrado", "La publicación fué eliminada", "success");
        obtenerPublicaciones();
      }
    });
  };
  const siguiente = async () => {
    try {
      //Constante iniciales
      const publicacionesRef = collection(db, "publicaciones");
      const q = query(
        publicacionesRef,
        orderBy("date", "desc"),
        startAfter(ultimo),
        limit(8)
      );
      //Destructuración de datos
      const { docs } = await getDocs(q);
      //Constante con datos del puntero
      const data = await getDocs(q);
      //Datos destructurados para el estado
      const arreglo = docs.map((item) => ({ id: item.id, ...item.data() }));
      //Si la información no existe
      if (data.empty) {
        setDesactivarSiguiente(true);
      } else {
        //Si existe la información
        setDesactivarAnterior(false);
        setDesactivarSiguiente(false);
        setPrimero(data.docs[0]);
        setUltimo(data.docs[data.docs.length - 1]);
        setPublicaciones(arreglo);
        setContador(contador + 1);

        //una busqueda siguiente para desactivar o no el botón
        const q2 = query(
          publicacionesRef,
          orderBy("date", "desc"),
          startAfter(data.docs[data.docs.length - 1]),
          limit(8)
        );
        const busquedaSiguiente = await getDocs(q2);
        if (busquedaSiguiente.empty) {
          setDesactivarSiguiente(true);
        } else {
          setDesactivarSiguiente(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const anterior = async () => {
    try {
      const publicacionesRef = collection(db, "publicaciones");
      const q = query(
        publicacionesRef,
        orderBy("date", "asc"),
        startAfter(primero),
        limit(8)
      );
      const { docs } = await getDocs(q);
      const data = await getDocs(q);
      const arreglo = docs.map((item) => ({ id: item.id, ...item.data() }));
      if (data.empty) {
        setDesactivarAnterior(true);
      } else {
        setDesactivarAnterior(false);
        setDesactivarSiguiente(false);
        setUltimo(data.docs[0]);
        setPrimero(data.docs[data.docs.length - 1]);
        setPublicaciones(arreglo.reverse());
        setContador(contador - 1);

        //una busqueda siguiente para desactivar o no el botón
        const q2 = query(
          publicacionesRef,
          orderBy("date", "asc"),
          startAfter(data.docs[data.docs.length - 1]),
          limit(8)
        );
        const busquedaSiguiente = await getDocs(q2);
        if (busquedaSiguiente.empty) {
          setDesactivarAnterior(true);
        } else {
          setDesactivarAnterior(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    obtenerPublicaciones();
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
            <h3 className="mt-2">Publicaciones</h3>
            <div
              className="p-3 border border border-1"
              style={{ backgroundColor: "white" }}
            >
              <div className="d-flex justify-content-between row">
                <p className="fw-bold fs-6 col-12 col-md-4">
                  Todas las publicaciones
                </p>
                <Link
                  className="btn btn-primary col-12 col-md-4 me-3"
                  to="/Nueva-Publicacion"
                >
                  Agregar nueva publicación
                </Link>
              </div>
              <div className="table-responsive">
                <table class="table table-striped table-hover mt-3 ">
                  <thead className="table-dark">
                    <tr className="fs-6">
                      <th>Título</th>
                      <th>Publicador y fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publicaciones
                      ? publicaciones.map((publicacion) => (
                          <tr className="fs-6 text-capitalize ">
                            <td>
                              {publicacion.urlImagenPrincipal ? (
                                <div className="d-flex align-items-center">
                                  <div>
                                    <img
                                      className="rounded-circle"
                                      src={publicacion.urlImagenPrincipal.url}
                                      width="50"
                                      alt=""
                                    />
                                  </div>
                                  <div className="ms-2">
                                    {publicacion.titulo}
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center">
                                  <div className="ms-2">
                                    {publicacion.titulo}
                                  </div>
                                </div>
                              )}
                            </td>
                            <td>
                              <ul className="list-unstyled">
                                <li>{publicacion.autor}</li>
                                <li
                                  className="text-secondary ms-3"
                                  style={{ fontSize: "70%" }}
                                >
                                  {publicacion.fecha} - {publicacion.hora}
                                </li>
                                {publicacion.autorEdicion ? (
                                  <div>
                                    <li
                                      className="text-secondary "
                                      style={{ fontSize: "70%" }}
                                    >
                                      Editado por: {publicacion.autorEdicion}
                                    </li>
                                    <li
                                      className="text-secondary"
                                      style={{ fontSize: "70%" }}
                                    >
                                      Fecha edicion: {publicacion.fechaEdicion}{" "}
                                      - {publicacion.horaEdicion}
                                    </li>
                                  </div>
                                ) : null}
                              </ul>
                            </td>
                            <td className="text-center">
                              <Link
                                to={`/Editar-Publicacion/${publicacion.id}`}
                              >
                                <FaEdit className="text-dark fs-3" />
                              </Link>
                              <a href="#">
                                <MdDelete
                                  className="fs-2"
                                  style={{ color: "red" }}
                                  onClick={() => {
                                    handleDeletePublicacion(
                                      publicacion.id,
                                      publicacion.idContenido,
                                      publicacion.urlImagenPrincipal.referencia,
                                      publicacion.urlImagenes
                                    );
                                  }}
                                />
                              </a>
                            </td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="d-flex justify-content-center btn-group w-25 my-3">
              <button
                className=" fs-3"
                disabled={desactivarAnterior}
                onClick={() => anterior()}
                style={{ border: "none" }}
              >
                <FaLongArrowAltLeft />
              </button>
              <button className="btn btn-white fs-3" disabled>
                {contador}
              </button>
              <button
                className="fs-3"
                disabled={desactivarSiguiente}
                onClick={() => siguiente()}
                style={{ border: "none" }}
              >
                <FaLongArrowAltRight />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Publicaciones;
