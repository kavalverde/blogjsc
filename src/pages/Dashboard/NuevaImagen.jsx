import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import db from "../../firebase/firestore";
import { collection, addDoc } from "firebase/firestore";

import storage from "../../firebase/firestorage";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const NuevaPublicacion = (props) => {
  const [loading, setLoading] = useState(true);
  const [descripcion, setDescripcion] = useState("");
  const [imagenes, setImagenes] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  //Crear Publicación
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imagenes === null) {
      setError("No ha seleccionado ninguna imagen");
    } else {
      try {
        Swal.fire(
          "Por favor, espera un momento mientras se sube la publicación"
        );
        const date = new Date();
        const day = date.getDay();
        const month = date.getMonth();
        const year = date.getFullYear();
        const fechaRef = `${day}-${month}-${year}`;
        const fecha = date.toLocaleDateString();

        //subir imagenes a storage
        let referenciaImagen = "";
        let datos;
        for (const key in imagenes) {
          if (Object.hasOwnProperty.call(imagenes, key)) {
            const imagen = imagenes[key];
            referenciaImagen = "images/galeria/" + fechaRef + "/" + imagen.name;
            const imageRef = await ref(storage, referenciaImagen);
            await uploadBytesResumable(imageRef, imagen);
            const resp = await getDownloadURL(imageRef);
            console.log(resp);
            datos = {
              url: resp,
              referencia: referenciaImagen,
              fecha,
              autor: props.usuario.nombre,
            };
            if (descripcion !== "") {
              datos.descripcion = descripcion;
            }
            await addDoc(collection(db, "galeria"), datos);
          }
        }
        Swal.fire(
          "Imagenes subidas",
          "Las imagenes se han subido a la galería correctamente",
          "success"
        ).then(navigate("/Galeria"));
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
          <h3 className="my-3">Agregar Imagenes</h3>
          <div className="container-fluid">
            <form className="w-75" onSubmit={handleSubmit}>
              <div className="">
                <label class="form-label">Imagenes</label>
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
              <div id="emailHelp" className="form-text mb-3">
                Seleccione una o varias imagenes
              </div>
              <div className="">
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
              <div id="emailHelp" className="form-text mb-3">
                La descripcion de las imagenes es opcional
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
                  value="Agregar imagenes"
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
