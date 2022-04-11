import React, { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

import db from "../../firebase/firestore";
import { collection, addDoc } from "firebase/firestore";

import storage from "../../firebase/firestorage";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const NuevaPublicacion = (props) => {
  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenPrincipal, setImagenPrincipal] = useState(null);
  const [imagenes, setImagenes] = useState(null);
  const [videos, setVideos] = useState([{ url: "" }]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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

  //Crear Publicación
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (titulo === "") {
      setError("Titulo no puede estar vacio");
    } else {
      try {
        Swal.fire(
          "Por favor, espera un momento mientras se sube la publicación"
        );
        const idContenidoPublicacion = Math.random().toString(36).slice(2);
        const date = new Date();
        const fecha = date.toLocaleDateString();
        const hora = date.toLocaleTimeString();

        const nuevaPublicacion = {
          titulo,
          descripcion,
          videos,
          fecha,
          hora,
          date,
          autor: props.usuario.nombre,
          idContenido: idContenidoPublicacion,
        };
        //Subir Imagen principal a storage
        if (imagenPrincipal !== null) {
          const referenciaPrincipal =
            "images/publicacion/" +
            idContenidoPublicacion +
            "/principal/" +
            imagenPrincipal.name;
          const profileRef = await ref(storage, referenciaPrincipal);
          await uploadBytesResumable(profileRef, imagenPrincipal);
          await getDownloadURL(profileRef).then((url) => {
            const DatosImgPrincipal = {
              url: url,
              referencia: referenciaPrincipal,
            };
            nuevaPublicacion.urlImagenPrincipal = DatosImgPrincipal;
          });
        }
        //subir imagenes a storage
        if (imagenes !== null) {
          let referenciaImagen = "";
          const imagenesURL = [];
          let datos;
          for (const key in imagenes) {
            if (Object.hasOwnProperty.call(imagenes, key)) {
              const imagen = imagenes[key];
              referenciaImagen =
                "images/publicacion/" +
                idContenidoPublicacion +
                "/" +
                imagen.name;
              const imageRef = await ref(storage, referenciaImagen);
              await uploadBytesResumable(imageRef, imagen);
              const resp = await getDownloadURL(imageRef);
              console.log(resp);
              datos = {
                url: resp,
                referencia: referenciaImagen,
              };
              imagenesURL.push(datos);
            }
          }
          nuevaPublicacion.urlImagenes = imagenesURL;
        }

        console.log(nuevaPublicacion);
        await addDoc(collection(db, "publicaciones"), nuevaPublicacion);
        Swal.fire(
          "Publicación creada",
          "La publicación se ha creado correctamente",
          "success"
        ).then(navigate("/Publicaciones"));
      } catch (e) {
        console.error("Error adding document: ", e);
        setError("Error creando la publicación, por favor intente de nuevo");
      }
    }
  };

  //Cargar al inicio
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="container">
      {loading === false && props.usuario.tipo === "administrador" ? (
        <div className="w-100">
          <h3 className="mt-3">Nueva Publicación</h3>
          <div className="container-fluid">
            <form className="w-75" onSubmit={handleSubmit}>
              <div class="mb-3">
                <label class="form-label">Título</label>
                <input
                  className="form-control"
                  id="titulo"
                  type="text"
                  placeholder="Ingrese el título para la publicación"
                  onChange={(e) => {
                    setTitulo(e.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label class="form-label">Imagen Principal</label>
                <input
                  className="form-control"
                  type="file"
                  id="imagenPrincipal"
                  accept="image/png, .jpeg, .jpg, .gif"
                  onChange={(e) => {
                    setImagenPrincipal(e.target.files[0]);
                  }}
                />
              </div>
              <div className="mb-3">
                <label class="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  id="descripcion"
                  type="textarea"
                  placeholder="Ingrese una descripción"
                  onChange={(e) => {
                    setDescripcion(e.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label class="form-label">Agregar Imagenes</label>
                <input
                  className="form-control"
                  type="file"
                  id="imagenes"
                  accept="image/png, .jpeg, .jpg, .gif"
                  multiple
                  onChange={(e) => {
                    setImagenes(e.target.files);
                  }}
                />
              </div>
              <div className="mb-3">
                <label class="form-label">Agregar Videos</label>
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
                  value="Agregar nueva publicación"
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
