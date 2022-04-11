import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import db from "../../firebase/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const NuevaPublicacion = (props) => {
  const [loading, setLoading] = useState(true);
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  //Llamar Datos
  const getImagen = async (id) => {
    const referencia = doc(db, "galeria", id);
    const respuesta = await getDoc(referencia);
    if (respuesta.exists()) {
      setImagen(respuesta.data().url);
      setDescripcion(respuesta.data().descripcion);
    } else {
      console.log("No such document!");
    }
  };

  //Crear Publicación
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "galeria", id);
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
          const data = {
            descripcion,
          };
          await updateDoc(docRef, data);
          Swal.fire(
            "Publicación editada",
            "La publicación se ha editado correctamente",
            "success"
          ).then(navigate("/Galeria"));
        }
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      setError("Error creando la publicación, por favor intente de nuevo");
    }
  };

  //Cargar al inicio
  useEffect(() => {
    getImagen(id);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      {loading === false && props.usuario.tipo === "administrador" ? (
        <div className="w-100">
          <h3 className="my-3">Editar Imagen</h3>
          <div className="container-fluid">
            <form className="w-75" onSubmit={handleSubmit}>
              <div className="d-flex flex-column">
                <label class="form-label">Imagen</label>
                <img
                  src={imagen}
                  alt="imagen"
                  className="img-fluid"
                  width="200"
                />
              </div>
              <div className="mt-3">
                <label class="form-label">Descripción</label>
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
                  value="Editar la imagen"
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
