import React, { useState, useEffect } from "react";
import Navbar from "../components/ui/Navbar";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import Swal from "sweetalert2";

import db from "../firebase/firestore";
import {
  collection,
  getDocs,
  limit,
  query,
  orderBy,
  startAfter,
} from "firebase/firestore";

const Album = () => {
  const [galeria, setGaleria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [primero, setPrimero] = useState(null);
  const [ultimo, setUltimo] = useState(null);
  const [desactivarSiguiente, setDesactivarSiguiente] = useState(false);
  const [desactivarAnterior, setDesactivarAnterior] = useState(true);
  const [contador, setContador] = useState(1);

  const obtenerImagenes = async () => {
    const imageRef = collection(db, "galeria");
    const q = query(imageRef, orderBy("fecha", "desc"), limit(12));
    const { docs } = await getDocs(q);
    const data = await getDocs(q);
    setPrimero(data.docs[0]);
    setUltimo(data.docs[data.docs.length - 1]);
    const arreglo = docs.map((item) => ({ id: item.id, ...item.data() }));
    setGaleria(arreglo);
  };

  const siguiente = async () => {
    try {
      //Constante iniciales
      const publicacionesRef = collection(db, "galeria");
      const q = query(
        publicacionesRef,
        orderBy("fecha", "desc"),
        startAfter(ultimo),
        limit(12)
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
          limit(12)
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
        limit(12)
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
          limit(12)
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

  const resizeImg = (img, descripcion) => {
    let descr = "";
    try {
      descr = descripcion;
    } catch (error) {
      console.log(error);
    }
    Swal.fire({
      imageUrl: img,
      imageWidth: "100%",
      imageAlt: "Imagen de galería",
      showCloseButton: true,
      showConfirmButton: false,
      text: descr,
    });
  };

  useEffect(() => {
    obtenerImagenes();
    setLoading(false);
  }, []);
  return (
    <div>
      <Navbar />
      <h3 className="ms-3 mt-3 text-center text-uppercase fw-bold">Album</h3>
      {loading === false ? (
        <div div className="container-fluid w-100 ">
          <div className="mt-3 row d-flex justify-content-center">
            {galeria
              ? galeria.map((imagen) => (
                  <div
                    className="border border-2 d-flex flex-column m-1 col-5 col-md-3"
                    style={{ width: "45vh", cursor: "pointer" }}
                  >
                    <div style={{ height: "40vh", width: "100%" }}>
                      {imagen.url ? (
                        <img
                          className="mt-2"
                          src={imagen.url}
                          alt="logo"
                          width="100%"
                          style={{
                            height: "85%",
                            objectFit: "cover",
                            objectPosition: "center center",
                          }}
                          onClick={() =>
                            resizeImg(imagen.url, imagen.descripcion)
                          }
                        />
                      ) : null}
                      <div>
                        <p
                          className="text-center text-secondary mt-1"
                          style={{ fontSize: "2vh" }}
                        >
                          {imagen.fecha}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              : null}
            <div className="w-100"></div>
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
    </div>
  );
};

export default Album;
