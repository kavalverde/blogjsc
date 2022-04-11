/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GoEye } from "react-icons/go";
import { AiOutlineFunction } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { ImStatsBars } from "react-icons/im";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";

import db from "../../firebase/firestore";
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  orderBy,
  updateDoc,
  limit,
  startAfter,
  where,
  query,
} from "firebase/firestore";

import PreviewForm from "../../components/PreviewForm";
import Analytics from "../../components/Analytics";
import Grafics from "../../components/Grafics";

const Estadisticas = (props) => {
  const [publicaciones, setPublicaciones] = useState(null);
  const [loading, setLoading] = useState(true);
  const [primero, setPrimero] = useState(null);
  const [ultimo, setUltimo] = useState(null);
  const [desactivarSiguiente, setDesactivarSiguiente] = useState(false);
  const [desactivarAnterior, setDesactivarAnterior] = useState(true);
  const [contador, setContador] = useState(1);

  const MySwal = withReactContent(Swal);

  //Funcion para obtener las entradas de la base de datos
  const obtenerPublicaciones = async () => {
    const publicacionesRef = collection(db, "encuestas");
    const q = query(publicacionesRef, orderBy("date", "desc"), limit(8));
    const { docs } = await getDocs(q);
    const data = await getDocs(q);
    setPrimero(data.docs[0]);
    setUltimo(data.docs[data.docs.length - 1]);
    const arreglo = docs.map((item) => ({ id: item.id, ...item.data() }));
    setPublicaciones(arreglo);
  };
  //Funcion borrar publicaciones
  const handleDeletePublicacion = async (id) => {
    const borrarEncuestas = async () => {
      const respuestaRef = collection(db, "respuestas");
      const q = await query(respuestaRef, where("idFormulario", "==", id));
      const { docs } = await getDocs(q);
      const arreglo = docs.map((item) => ({ id: item.id, ...item.data() }));
      arreglo.forEach(async (item) => {
        await deleteDoc(doc(db, "respuestas", item.id));
      });
    };
    borrarEncuestas();
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
        await deleteDoc(doc(db, "encuestas", id));
        borrarEncuestas();
        Swal.fire("Borrado", "La encuesta fué eliminada", "success");
        obtenerPublicaciones();
      }
    });
  };
  const siguiente = async () => {
    try {
      //Constante iniciales
      const publicacionesRef = collection(db, "encuestas");
      const q = query(
        publicacionesRef,
        orderBy("date", "desc"),
        startAfter(ultimo),
        limit(5)
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
          limit(5)
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
      const publicacionesRef = collection(db, "encuestas");
      const q = query(
        publicacionesRef,
        orderBy("date", "asc"),
        startAfter(primero),
        limit(5)
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
          limit(5)
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
  const handlePreview = (id) => {
    MySwal.fire(<PreviewForm id={id} />);
  };
  //Revisar analíticas
  const handleAnalytics = (id) => {
    MySwal.fire({
      html: <Analytics id={id} />,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: false,
    });
  };
  //Revisar graficos
  const handleGrafics = (id) => {
    MySwal.fire({
      html: <Grafics id={id} />,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: false,
    });
  };
  //Cambiar de estado
  const actualizarEstado = async (e, id) => {
    console.log(e);
    const docRef = doc(db, "encuestas", id);
    await updateDoc(docRef, {
      estado: e,
    });
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
            <h3 className="mt-2">Estadisticas</h3>
            <div
              className="p-3 border border border-1"
              style={{ backgroundColor: "white" }}
            >
              <div className="d-flex justify-content-between row">
                <p className="fw-bold fs-6 col-12 col-md-4">
                  Todas las encuestas
                </p>
                <Link
                  className="btn btn-primary col-12 col-md-4 me-3"
                  to="/Encuesta"
                >
                  Agregar nueva encuesta
                </Link>
              </div>
              <div className="table-responsive">
                <table class="table table-striped table-hover mt-3 ">
                  <thead className="table-dark">
                    <tr className="fs-6 text-center">
                      <th>Título</th>
                      <th>Publicador y fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publicaciones
                      ? publicaciones.map((publicacion) => (
                          <tr className="fs-6 text-capitalize text-center">
                            <td>
                              <div>
                                <div>{publicacion.titulo}</div>
                              </div>
                            </td>
                            <td>
                              <ul className="list-unstyled">
                                <li>{publicacion.autor}</li>
                                <li
                                  className="text-secondary"
                                  style={{ fontSize: "70%" }}
                                >
                                  {publicacion.fecha} - {publicacion.hora}
                                </li>
                              </ul>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-center">
                                <a
                                  href="#"
                                  onClick={() => handlePreview(publicacion.id)}
                                >
                                  <GoEye className="fs-2 " />
                                </a>
                                <a
                                  href="#"
                                  onClick={() => {
                                    handleAnalytics(publicacion.id);
                                  }}
                                >
                                  <AiOutlineFunction className="fs-2 text-dark mx-1" />
                                </a>
                                <a
                                  href="#"
                                  onClick={() => {
                                    handleGrafics(publicacion.id);
                                  }}
                                >
                                  <ImStatsBars className="fs-2 text-success mx-1" />
                                </a>

                                <a
                                  href="#"
                                  onClick={() => {
                                    handleDeletePublicacion(publicacion.id);
                                  }}
                                >
                                  <MdDelete
                                    className="fs-2"
                                    style={{
                                      color: "red",
                                    }}
                                  />
                                </a>
                                <div className="ms-2 w-25">
                                  <select
                                    className="form-select"
                                    onChange={(e) =>
                                      actualizarEstado(
                                        e.target.value,
                                        publicacion.id
                                      )
                                    }
                                  >
                                    <option disabled value={publicacion.estado}>
                                      {publicacion.estado}
                                    </option>
                                    <option value="Disponible">
                                      Disponible
                                    </option>
                                    <option value="No disponible">
                                      No disponible
                                    </option>
                                  </select>
                                </div>
                              </div>
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

export default Estadisticas;
