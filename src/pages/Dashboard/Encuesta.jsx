import React, { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

import db from "../../firebase/firestore";
import { collection, addDoc } from "firebase/firestore";

const Encuesta = (props) => {
  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState("");
  const [preguntas, setPreguntas] = useState([
    { titulo: "", opciones: [{ texto: "" }] },
  ]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  //Controlar form dinamico Pregunta
  const handlePreguntaInputChange = (index, event) => {
    const values = [...preguntas];
    values[index].titulo = event.target.value;
    setPreguntas(values);
  };
  const handlePreguntaAddFields = () => {
    const values = [...preguntas];
    values.push({ titulo: "", opciones: [{ texto: "" }] });
    setPreguntas(values);
  };

  const handlePreguntaRemoveFields = (index) => {
    const values = [...preguntas];
    if (values.length <= 1) {
      return;
    } else {
      values.splice(index, 1);
      setPreguntas(values);
    }
  };
  //Controlar form dinamico Opciones
  const handleOpcionInputChange = (index, index2, event) => {
    const values = [...preguntas];
    values[index].opciones[index2].texto = event.target.value;
    console.log(values);
    setPreguntas(values);
  };
  const handleOpcionAddFields = (index) => {
    const values = [...preguntas];
    values[index].opciones.push({ texto: "" });
    console.log(values);
    setPreguntas(values);
  };

  const handleOpcionRemoveFields = (index, index2) => {
    const values = [...preguntas];
    if (values[index].opciones.length <= 1) {
      return;
    } else {
      values[index].opciones.splice(index2, 1);
      console.log(values);
      setPreguntas(values);
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
        const date = new Date();
        const fecha = date.toLocaleDateString();
        const hora = date.toLocaleTimeString();

        const nuevaPublicacion = {
          titulo,
          preguntas,
          fecha,
          hora,
          date,
          autor: props.usuario.nombre,
          estado: "Disponible",
        };
        await addDoc(collection(db, "encuestas"), nuevaPublicacion);
        Swal.fire(
          "Encuesta creada",
          "La encuesta se ha creado correctamente",
          "success"
        ).then(navigate("/Estadisticas"));
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
          <h3 className="mt-3">Nueva Encuesta</h3>
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
                <label class="form-label">Agregar Preguntas</label>
                {preguntas.map((pregunta, index) => (
                  <Fragment key={`${pregunta}~${index}`}>
                    <div className="input-group col-md-6 my-1">
                      <input
                        type="text"
                        className="form-control"
                        id="pregunta"
                        value={pregunta.titulo}
                        placeholder="Título"
                        onChange={(e) => handlePreguntaInputChange(index, e)}
                      />
                      <div className="w-100"></div>
                      <div>
                        {pregunta.opciones ? (
                          <div>
                            {pregunta.opciones.map((opcion, index2) => (
                              <Fragment key={`${opcion}~${index2}`}>
                                <div className="d-flex align-items-center my-2 ms-4">
                                  <input
                                    type="radio"
                                    checked
                                    style={{ width: "30px", height: "30px" }}
                                    className="mt-2"
                                  />
                                  <input
                                    type="text"
                                    className="form-control ms-2 mt-2"
                                    id="opcion"
                                    value={opcion.texto}
                                    placeholder="Ingrese una opción"
                                    onChange={(e) =>
                                      handleOpcionInputChange(index, index2, e)
                                    }
                                  />
                                  <div className="d-flex ms-2">
                                    <button
                                      className="btn fs-2"
                                      type="button"
                                      onClick={() =>
                                        handleOpcionRemoveFields(index, index2)
                                      }
                                      style={{
                                        color: "red",
                                        textDecoration: "inherit",
                                      }}
                                    >
                                      <MdDelete />
                                    </button>
                                    <button
                                      className="btn fs-2"
                                      type="button"
                                      style={{
                                        color: "black",
                                        textDecoration: "inherit",
                                      }}
                                      onClick={() =>
                                        handleOpcionAddFields(index)
                                      }
                                    >
                                      <IoMdAdd />
                                    </button>
                                  </div>
                                </div>
                              </Fragment>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <div className="w-100"></div>
                      <div className="btn-group ms-2 w-100">
                        <button
                          className="btn btn-danger fs-5"
                          type="button"
                          onClick={() => handlePreguntaRemoveFields(index)}
                        >
                          Quitar pregunta
                        </button>
                        <button
                          className="btn btn-primary fs-5"
                          type="button"
                          style={{
                            color: "white",
                            textDecoration: "inherit",
                          }}
                          onClick={() => handlePreguntaAddFields()}
                        >
                          Agregar pregunta
                        </button>
                      </div>
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
                  value="Agregar nueva encuesta"
                />
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Encuesta;
