import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import db from "../firebase/firestore";
import {
  collection,
  getDocs,
  limit,
  query,
  orderBy,
  startAfter,
} from "firebase/firestore";

import FormularioForm from "../components/FormularioForm";
import Navbar from "../components/ui/Navbar";

const Home = () => {
  const [galeria, setGaleria] = useState(null);
  const [publicaciones, setPublicaciones] = useState(null);
  const [encuestas, setEncuestas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [primero, setPrimero] = useState(null);
  const [ultimo, setUltimo] = useState(null);
  const [desactivarSiguiente, setDesactivarSiguiente] = useState(false);
  const [desactivarAnterior, setDesactivarAnterior] = useState(true);
  const [contador, setContador] = useState(1);

  const imgPlaceholder = require("../assets/img/placeholder.jpg");
  const imgEncuesta = require("../assets/img/encuesta.jpg");

  const MySwal = withReactContent(Swal);

  const obtenerImagenes = async () => {
    const imageRef = collection(db, "galeria");
    const q = query(imageRef, orderBy("fecha", "desc"), limit(10));
    const { docs } = await getDocs(q);
    const arreglo = docs.map((item) => ({ id: item.id, ...item.data() }));
    setGaleria(arreglo);
  };

  //Obtener publicaciones
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
  //Obtener encuestas
  const obtenerEncuestas = async () => {
    const encuestasRef = collection(db, "encuestas");
    const q = query(encuestasRef, orderBy("date", "desc"));
    const { docs } = await getDocs(q);
    const arreglo = docs.map((item) => ({ id: item.id, ...item.data() }));
    setEncuestas(arreglo);
  };
  //controlar paginación de publicaciones
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
  const expandirPublicacion = (publicacion) => {
    let imagenPrincipalUrl = imgPlaceholder;
    try {
      imagenPrincipalUrl = publicacion.urlImagenPrincipal.url;
    } catch (error) {
      console.log(error);
    }
    const imagenes = () => {
      let imagenesUrl = "";
      try {
        publicacion.urlImagenes.forEach((item) => {
          imagenesUrl += `<a href="${item.url}" target="_blank"><img src="${item.url}" alt="foto" width="50%"/></a>`;
        });
      } catch (error) {
        console.log(error);
      }
      return imagenesUrl;
    };
    const videos = () => {
      let videosUrl = "";
      let stringVideo = "";
      try {
        publicacion.videos.forEach((item) => {
          if (item.url === "") {
            return;
          }
          stringVideo = item.url.substring(item.url.indexOf("=") + 1);
          if (stringVideo === "") {
            stringVideo = item.url.substring(item.url.indexOf("/") + 1);
          }
          videosUrl += `<iframe
          width="70%"
          height="100%"
          src="https://www.youtube.com/embed/${stringVideo}"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>`;
        });
      } catch (error) {
        console.log(error);
      }

      return videosUrl;
    };
    Swal.fire({
      confirmButtonText: "Cerrar",
      width: "80%",
      color: "#716add",
      html: `
      
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h3 class="text-center">${publicacion.titulo}</h3>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
          <p class="fw-bold fs-6 text-secondary">${publicacion.fecha} - ${
        publicacion.hora
      }</p>
          </div>
        </div>
        <div class="row">
          <div class="col-12">   
          <a href="${imagenPrincipalUrl}" target="_blank"><img src="${imagenPrincipalUrl}" alt="foto" width="80%"/></a>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <p class="text-center fs-5 mt-3 mb-5 mx-3">${
              publicacion.descripcion
            }</p>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
          <p class="fw-bold fs-4">Imagenes adjuntas: </p>
            ${imagenes()}
          </div>
        </div>
        <div class="row">
          <div class="col-12">
          <p class="fw-bold fs-4">Videos adjuntos: </p>
            ${videos()}
          </div>
        </div>
        <div className="w-100"></div>
      </div>
      `,
    });
  };
  //Completar encuestas
  const handleEncuesta = (id) => {
    MySwal.fire({
      html: <FormularioForm id={id} />,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: false,
    });
  };
  useEffect(() => {
    obtenerImagenes();
    obtenerPublicaciones();
    obtenerEncuestas();
    setLoading(false);
  }, []);
  return (
    <div>
      <Navbar />
      {loading === false ? (
        <div className="container-fluid w-100">
          <div className="row">
            <div className="col-12 col-md-4 d-flex justify-content-center align-items-center">
              <h1 className="ms-5 text-center">
                Movimiento Juventud, Solidaridad y Cambio
              </h1>
            </div>
            <div className="col-12 col-md-8">
              {/* Carousel de imagenes */}
              {galeria ? (
                <Link to="Album">
                  <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                    }}
                    pagination={{
                      clickable: true,
                    }}
                    navigation={false}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper mt-4 rounded"
                    style={{ width: "80%", height: "60vh" }}
                  >
                    {galeria.map((foto) => (
                      <SwiperSlide className="d-flex justify-content-center align-items-center">
                        <img
                          src={foto.url}
                          alt="foto"
                          width="100%"
                          height="400vh"
                          style={{
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center center",
                          }}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Link>
              ) : null}
            </div>
          </div>
          {/* Encuestas */}
          <div className="mt-3 ms-4">
            {encuestas
              ? encuestas.map((encuesta) => (
                  <div>
                    {encuesta.estado === "Disponible" ? (
                      <div
                        className="row border w-100 mb-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEncuesta(encuesta.id)}
                      >
                        <div
                          className="col-12 col-md-5"
                          style={{ height: "40vh" }}
                        >
                          <img
                            src={imgEncuesta}
                            alt="encuesta"
                            width="100%"
                            style={{
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "center center",
                              padding: "0.5vh",
                            }}
                          />
                        </div>
                        <div className="col-12 col-md-7 d-flex justify-content-center align-items-center flex-column">
                          <h3 className="mb-4">{encuesta.titulo}</h3>
                          <p>Por favor ayudanos completando esta encuesta</p>
                          <p
                            className="text-secondary"
                            style={{ fontSize: "1.8vh" }}
                          >
                            {encuesta.fecha}
                          </p>
                        </div>
                        <div className="w-100"></div>
                      </div>
                    ) : null}
                  </div>
                ))
              : null}
          </div>
          {/* Publicaciones */}
          <div className="mt-3 row d-flex justify-content-center">
            {publicaciones
              ? publicaciones.map((publicacion) => (
                  <div
                    className="border border-2 d-flex flex-column m-1 col-5 col-md-3"
                    style={{ width: "45vh", cursor: "pointer" }}
                    onClick={() => {
                      expandirPublicacion(publicacion);
                    }}
                  >
                    <div style={{ height: "40vh", width: "100%" }}>
                      {publicacion.urlImagenPrincipal ? (
                        <img
                          className="mt-2"
                          src={publicacion.urlImagenPrincipal.url}
                          alt="logo"
                          width="100%"
                          style={{
                            height: "98%",
                            objectFit: "cover",
                            objectPosition: "center center",
                          }}
                        />
                      ) : (
                        <img
                          src={imgPlaceholder}
                          alt="logo"
                          width="100%"
                          style={{
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center center",
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <p className="fw-bold m-2 text-center fs-4">
                        {publicacion.titulo}
                      </p>
                      <p
                        className="text-sm-start m-2"
                        style={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {publicacion.descripcion}
                      </p>
                    </div>
                    <div>
                      <p
                        className="m-2 text-secondary text-center"
                        style={{ fontSize: "1.8vh" }}
                      >
                        {publicacion.fecha} - {publicacion.hora}
                      </p>
                    </div>
                    <div className="w-100"></div>
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

export default Home;
