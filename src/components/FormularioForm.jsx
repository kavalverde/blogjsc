import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";

import db from "../firebase/firestore";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";

const FormularioForm = (props) => {
  const [title, setTitle] = useState("");
  const [preguntas, setPreguntas] = useState(null);
  const [respuestas, setRespuestas] = useState([{ pregunta: "", opcion: "" }]);
  const [loading, setLoading] = useState(true);

  //Llamar Datos
  const getPublicacion = async (id) => {
    const referencia = doc(db, "encuestas", id);
    const respuesta = await getDoc(referencia);
    if (respuesta.exists()) {
      setTitle(respuesta.data().titulo);
      setPreguntas(respuesta.data().preguntas);
    } else {
      console.log("No such document!");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const datos = {
      idFormulario: props.id,
      respuestas,
    };
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Por favor, no olvides llenar todos los campos!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, continuar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await addDoc(collection(db, "respuestas"), datos);
        Swal.fire(
          "Encuesta enviada",
          "La encuesta ha sido enviada exitosamente",
          "success"
        );
      }
    });
  };

  //Llenar respuestas
  const handleChange = (index, opcion, pregunta) => {
    const values = [...respuestas];
    if (index > 0 && values[index] === undefined) {
      values.push({ pregunta: "", opcion: "" });
    }
    values[index].pregunta = pregunta;
    values[index].opcion = opcion;
    setRespuestas(values);
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
              <Form onSubmit={handleSubmit}>
                <div>
                  <h1 className="fw-bold">{title}</h1>
                  <p className="fst-italic" style={{ fontSize: "2vh" }}>
                    Por favor, ayudanos completando esta encuesta. Si ya la haz
                    realizado anteriormente, no la vuelvas a completar:
                  </p>
                  {preguntas.map((pregunta, index) => (
                    <div>
                      <h2 className="fw-bold"> {pregunta.titulo}</h2>
                      {pregunta.opciones.map((opcion) => (
                        <div className="d-flex align-items-center">
                          <Form.Check
                            type="radio"
                            name={`opcion-${index}`}
                            onChange={(e) =>
                              handleChange(index, opcion.texto, pregunta.titulo)
                            }
                          />
                          <label
                            className="form-label ms-2 mt-2"
                            style={{ fontSize: "3vh" }}
                          >
                            {opcion.texto}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <Button variant="primary" type="submit">
                  Enviar
                </Button>
              </Form>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default FormularioForm;
