import React, { useEffect, useState, Fragment } from "react";

import db from "../firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

const PreviewForm = (props) => {
  const [title, setTitle] = useState("");
  const [preguntas, setPreguntas] = useState(null);
  const [loading, setLoading] = useState(true);

  //Llamar Datos
  const getPublicacion = async (id) => {
    const referencia = doc(db, "encuestas", id);
    const respuesta = await getDoc(referencia);
    if (respuesta.exists()) {
      console.log(respuesta.data());
      setTitle(respuesta.data().titulo);
      setPreguntas(respuesta.data().preguntas);
      console.log(respuesta.data().preguntas);
    } else {
      console.log("No such document!");
    }
  };

  //Cargar al inicio
  useEffect(() => {
    setLoading(false);
    getPublicacion(props.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      {loading === false ? (
        <div>
          {preguntas ? (
            <div>
              <h1 className="fw-bold">{title}</h1>
              {preguntas.map((pregunta, index) => (
                <div>
                  <h2 className="fw-bold"> {pregunta.titulo}</h2>
                  {pregunta.opciones.map((opcion, index2) => (
                    <div className="d-flex align-items-center ">
                      <input
                        type="radio"
                        style={{ width: "4vh", height: "4vh" }}
                      />
                      <label
                        className="form-label ms-2"
                        style={{ fontSize: "3vh" }}
                      >
                        {opcion.texto}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default PreviewForm;
