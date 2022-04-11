import React, { useEffect, useState } from "react";

import db from "../firebase/firestore";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const Analytics = (props) => {
  const [resultados, setResultados] = useState(null);
  const [loading, setLoading] = useState(true);

  //Llamar Datos
  const getDatos = async (id) => {
    //Encontrar las opciones
    let allResp = [];
    const EncuestaRef = doc(db, "encuestas", id);
    const respuesta = await getDoc(EncuestaRef);
    const respPreguntas = respuesta.data().preguntas;
    //Encontrar las respuestas
    const respuestaRef = collection(db, "respuestas");
    const q = await query(respuestaRef, where("idFormulario", "==", id));
    const { docs } = await getDocs(q);
    const arreglo = docs.map((item) => ({ id: item.id, ...item.data() }));

    arreglo.forEach((item) => {
      item.respuestas.forEach((resp) => {
        allResp.push(`${resp.pregunta}+${resp.opcion}`);
      });
    });

    if (allResp.length > 0) {
      let repetidos = [];
      let comparacion;
      respPreguntas.forEach((pregunta, index) => {
        if (repetidos[index] === undefined) {
          repetidos.push({
            pregunta: pregunta.titulo,
            opciones: [{ opcion: "", cantidad: 0 }],
          });
        }
        pregunta.opciones.forEach((opcion, index2) => {
          comparacion = `${pregunta.titulo}+${opcion.texto}`;
          let count = 0;
          let i = 0;
          allResp.forEach((element) => {
            if (comparacion === element) {
              count = count + 1;
            }
            if (i === allResp.length - 1) {
              if (repetidos[index].opciones[index2] === undefined) {
                repetidos[index].opciones.push({
                  opcion: "",
                  cantidad: 0,
                });
              }
              repetidos[index].opciones[index2].opcion = opcion.texto;
              repetidos[index].opciones[index2].cantidad = count;
            }
            i = i + 1;
          });
        });
      });
      setResultados(repetidos);
    } else {
      setResultados(null);
    }
  };

  //Cargar al inicio
  useEffect(() => {
    setLoading(false);
    getDatos(props.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      {loading === false ? (
        <div>
          <h3 className="fw-bold">Resultados de la encuesta</h3>
          {resultados ? (
            resultados.map((resultado) => (
              <div>
                <h4>{resultado.pregunta}</h4>
                {resultado.opciones.map((opcion) => (
                  <div>
                    <p>
                      <span className="fw-bold">{opcion.opcion}: </span>
                      <span>{opcion.cantidad}</span>
                    </p>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div>
              No hay resultados en este momento, intenta revisar más adelante
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Analytics;
