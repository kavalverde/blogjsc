/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

import db from "../../firebase/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import storage from "../../firebase/firestorage";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const NuevaPublicacion = (props) => {
  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenPrincipal, setImagenPrincipal] = useState(null);
  const [nuevaImagenPrincipal, setNuevaImagenPrincipal] = useState(null);
  const [imagenes, setImagenes] = useState(null);
  const [nuevasImagenes, setNuevasImagenes] = useState(null);
  const [videos, setVideos] = useState([{ url: "" }]);
  const [error, setError] = useState("");
  const [idContenido, setIDContenido] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  //Llamar Datos
  const getPublicacion = async (id) => {
    const referencia = doc(db, "publicaciones", id);
    const respuesta = await getDoc(referencia);
    if (respuesta.exists()) {
      setTitulo(respuesta.data().titulo);
      setImagenPrincipal(respuesta.data().urlImagenPrincipal);
      setDescripcion(respuesta.data().descripcion);
      setImagenes(respuesta.data().urlImagenes);
      setVideos(respuesta.data().videos);
      setIDContenido(respuesta.data().idContenido);
    } else {
      console.log("No such document!");
    }
  };

  //Controlar form dinamico videos
  const handleVideoInputChange = (index, event) => {
    const values = [...videos];

    values[index].url = event.target.value;

    setVideos(values);
  };
  const handleVideoAddFields = () => {
    const values = [...videos];
    values.push({ url: "" });
    setVideos(values);
  };

  const handleVideoRemoveFields = (index) => {
    const values = [...videos];
    if (values.length <= 1) {
      return;
    } else {
      values.splice(index, 1);
      setVideos(values);
    }
  };

  //EditarPublicacion Publicación
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (titulo === "") {
      setError("Titulo no puede estar vacio");
    } else {
      try {
        Swal.fire({
          title: "¿Estás seguro?",
          text: "¡No podrás revertir los cambios!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, Editar",
        }).then(async (result) => {
          if (result.isConfirmed) {
            Swal.fire(
              "Por favor, espera un momento mientras se edita la publicación"
            );

            const docRef = doc(db, "publicaciones", id);
            const date = new Date();
            const fecha = date.toLocaleDateString();
            const hora = date.toLocaleTimeString();

            const nuevaPublicacion = {
              titulo,
              descripcion,
              videos,
              date,
              autorEdicion: props.usuario.nombre,
              fechaEdicion: fecha,
              horaEdicion: hora,
            };
            //Cambiar Imagen principal a storage
            if (nuevaImagenPrincipal) {
              //borrar imagen anterior
              console.log(imagenPrincipal);
              try {
                const desertRef = await ref(
                  storage,
                  imagenPrincipal.referencia
                );
                await deleteObject(desertRef).then(console.log("borrado"));
              } catch (error) {
                console.log(error);
              }
              //subir nueva imagen
              const referenciaPrincipal =
                "images/publicacion/" +
                idContenido +
                "/principal/" +
                nuevaImagenPrincipal.name;
              console.log(referenciaPrincipal);
              const profileRef = await ref(storage, referenciaPrincipal);
              await uploadBytesResumable(profileRef, nuevaImagenPrincipal);
              await getDownloadURL(profileRef).then((url) => {
                const DatosImgPrincipal = {
                  url: url,
                  referencia: referenciaPrincipal,
                };
                console.log(DatosImgPrincipal);
                nuevaPublicacion.urlImagenPrincipal = DatosImgPrincipal;
              });
            }
            //subir imagenes a storage
            if (nuevasImagenes !== null) {
              let referenciaImagen = "";
              let imagenesURL = [];
              let datos;
              for (const key in nuevasImagenes) {
                if (Object.hasOwnProperty.call(nuevasImagenes, key)) {
                  const imagen = nuevasImagenes[key];
                  referenciaImagen =
                    "images/publicacion/" + idContenido + "/" + imagen.name;
                  console.log(referenciaImagen);
                  const imageRef = await ref(storage, referenciaImagen);
                  await uploadBytesResumable(imageRef, imagen);
                  const resp = await getDownloadURL(imageRef);
                  datos = {
                    url: resp,
                    referencia: referenciaImagen,
                  };
                  imagenesURL.push(datos);
                }
              }
              if (imagenes !== null) {
                imagenesURL = imagenesURL.concat(imagenes);
              }
              console.log(imagenesURL);
              nuevaPublicacion.urlImagenes = imagenesURL;
            }

            console.log(nuevaPublicacion);
            await updateDoc(docRef, nuevaPublicacion);
            Swal.fire(
              "Publicación editada",
              "La publicación se ha editado correctamente",
              "success"
            ).then(navigate("/Publicaciones"));
          }
        });
      } catch (e) {
        console.error("Error updating document: ", e);
        setError("Error editando la publicación, por favor intente de nuevo");
      }
    }
  };

  //Borrar Imagenes
  const handleDeleteImg = async (url, refere, index) => {
    console.log(url, refere, index);
    const docRef = doc(db, "publicaciones", id);
    const array = imagenes.filter((item) => item.url !== url);
    console.log(imagenes, array);
    const borrarImg = async (ref) => {
      const desertRef = await ref(storage, ref);
      await deleteObject(desertRef).then(console.log("borrado"));
    };
    const actualizarDoc = async (objeto) => {
      await updateDoc(docRef, {
        urlImagenes: objeto,
      });
    };

    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir los cambios!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Borrar",
    }).then((result) => {
      if (result.isConfirmed) {
        borrarImg(refere);
        actualizarDoc(array);
        Swal.fire("Borrado", "La imagen fué eliminada", "success");
        getPublicacion(id);
      }
    });
  };

  //Cargar al inicio
  useEffect(() => {
    setLoading(false);
    getPublicacion(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      {loading === false && props.usuario.tipo === "administrador" ? (
        <div className="w-100">
          <h3 className="mt-3">Editar Publicación</h3>
          <div className="container-fluid">
            <form className="w-75" onSubmit={handleSubmit}>
              <div class="mb-3">
                <label className="form-label">Título</label>
                <input
                  className="form-control"
                  id="titulo"
                  type="text"
                  placeholder="Ingrese el título para la publicación"
                  value={titulo}
                  onChange={(e) => {
                    setTitulo(e.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Imagen Principal</label>
                {imagenPrincipal ? (
                  <div className="m-2">
                    <img src={imagenPrincipal.url} alt="imagen" height="100" />
                    <div id="emailHelp" className="form-text">
                      Imagen actual.
                    </div>
                  </div>
                ) : null}
                <input
                  className="form-control"
                  type="file"
                  id="imagenPrincipal"
                  accept="image/png, .jpeg, .jpg, .gif"
                  onChange={(e) => {
                    setNuevaImagenPrincipal(e.target.files[0]);
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  id="descripcion"
                  type="textarea"
                  placeholder="Ingrese una descripción"
                  value={descripcion}
                  onChange={(e) => {
                    setDescripcion(e.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Agregar Imagenes</label>
                {imagenes ? (
                  <div className="d-flex">
                    {imagenes.map((imagen, index) => (
                      <div className="m-2 border border-2 rounded p-2 d-flex align-items-center flex-column">
                        <p>{index + 1}</p>
                        <img src={imagen.url} alt="imagen" height="100" />
                        <a
                          href="#"
                          onClick={() =>
                            handleDeleteImg(
                              imagen.url,
                              imagen.referencia,
                              index
                            )
                          }
                        >
                          <MdDelete className="text-danger fs-3 m-1" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : null}
                <div id="emailHelp" className="form-text mb-3">
                  Todas las imagenes
                </div>
                <input
                  className="form-control"
                  type="file"
                  id="imagenes"
                  accept="image/png, .jpeg, .jpg, .gif"
                  multiple
                  onChange={(e) => {
                    setNuevasImagenes(e.target.files);
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Agregar Videos</label>
                {videos.map((video, index) => (
                  <Fragment key={`${video}~${index}`}>
                    <div className="input-group col-md-6 my-1">
                      <input
                        type="text"
                        className="form-control"
                        id="video"
                        value={video.url}
                        placeholder="https://www.youtube.com/watch?v=ScMzIvxBSi4&t=1s"
                        onChange={(e) => handleVideoInputChange(index, e)}
                      />
                      <button
                        className="btn btn-danger fs-5"
                        type="button"
                        onClick={() => handleVideoRemoveFields(index)}
                      >
                        <MdDelete />
                      </button>
                      <button
                        className="btn btn-primary fs-5"
                        type="button"
                        style={{ color: "white", textDecoration: "inherit" }}
                        onClick={() => handleVideoAddFields()}
                      >
                        <IoMdAdd />
                      </button>
                    </div>
                  </Fragment>
                ))}
              </div>
              {error ? (
                <div>
                  <div className="alert alert-danger">
                    <p>{error}</p>
                  </div>
                </div>
              ) : null}
              <div className="mb-3 d-flex justify-content-center row">
                <input
                  className="btn btn-dark mt-2 py-3 col-12 col-md-6"
                  type="submit"
                  value="Editar publicación"
                />
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NuevaPublicacion;
