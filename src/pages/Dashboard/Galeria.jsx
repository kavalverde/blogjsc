/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
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

const Galeria = (props) => {
  const [galeria, setGaleria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [primero, setPrimero] = useState(null);
  const [desactivarAnterior, setDesactivarAnterior] = useState(true);
  const [desactivarSiguiente, setDesactivarSiguiente] = useState(false);
  const [ultimo, setUltimo] = useState(null);
  const [contador, setContador] = useState(1);

  const obtenerImagenes = async () => {
    const imageRef = collection(db, "galeria");
    const q = query(imageRef, orderBy("fecha", "desc"), limit(8));
    const { docs } = await getDocs(q);
    const data = await getDocs(q);
    setPrimero(data.docs[0]);
    setUltimo(data.docs[data.docs.length - 1]);
    const arreglo = docs.map((item) => ({ id: item.id, ...item.data() }));
    setGaleria(arreglo);
  };
  //Imagen más grande
  const resizeImg = (img) => {
    Swal.fire({
      imageUrl: img,
      imageWidth: 600,
      imageHeight: 500,
      imageAlt: "Imagen de galería",
      showCloseButton: true,
      showConfirmButton: false,
    });
  };

  //Borrar imagen
  const handleDeleteImg = async (id, referencia) => {
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
        try {
          await deleteDoc(doc(db, "galeria", id));
          await deleteObject(ref(storage, referencia)).then(
            console.log("borrado")
          );
        } catch (error) {
          console.log(error);
        }
        Swal.fire("Borrado", "La imagen fué eliminada", "success");
        obtenerImagenes();
      }
    });
  };

  const siguiente = async () => {
    try {
      //Constante iniciales
      const publicacionesRef = collection(db, "galeria");
      const q = query(
        publicacionesRef,
        orderBy("fecha", "desc"),
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
        setGaleria(arreglo);
        setContador(contador + 1);

        //una busqueda siguiente para desactivar o no el botón
        const q2 = query(
          publicacionesRef,
          orderBy("fecha", "desc"),
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
      const publicacionesRef = collection(db, "galeria");
      const q = query(
        publicacionesRef,
        orderBy("fecha", "asc"),
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
        setGaleria(arreglo.reverse());
        setContador(contador - 1);

        //una busqueda siguiente para desactivar o no el botón
        const q2 = query(
          publicacionesRef,
          orderBy("fecha", "asc"),
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
    obtenerImagenes();
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
            <h3 className="mt-2">Galería</h3>
            <div
              className="p-3 border border border-1"
              style={{ backgroundColor: "white" }}
            >
              <div className="d-flex justify-content-between row">
                <p className="fw-bold fs-6 col-12 col-md-4">
                  Todas las fotos de Galería
                </p>
                <Link
                  className="btn btn-primary col-12 col-md-4 me-3"
                  to="/Nueva-Imagen"
                >
                  Agregar nuevas imagenes
                </Link>
              </div>
              <div className="table-responsive">
                <table class="table table-striped table-hover mt-3 ">
                  <thead className="table-dark">
                    <tr className="fs-6">
                      <th>Imagen</th>
                      <th>Descripción</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {galeria
                      ? galeria.map((foto) => (
                          <tr className="fs-6">
                            <td>
                              <div>
                                <img
                                  className="rounded-circle"
                                  src={foto.url}
                                  alt="Foto"
                                  width="60"
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  onClick={() => resizeImg(foto.url)}
                                />
                              </div>
                            </td>
                            <td>
                              <div className="">
                                <p>{foto.descripcion}</p>
                                <p
                                  className="text-secondary"
                                  style={{ fontSize: "70%" }}
                                >
                                  Fecha de subida: {foto.fecha}
                                </p>
                              </div>
                            </td>
                            <td className="text-center">
                              <Link to={`/Editar-Imagen/${foto.id}`}>
                                <FaEdit className="text-dark fs-3" />
                              </Link>
                              <a
                                href="#"
                                onClick={() =>
                                  handleDeleteImg(foto.id, foto.referencia)
                                }
                              >
                                <MdDelete
                                  className="fs-2"
                                  style={{ color: "red" }}
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

export default Galeria;
