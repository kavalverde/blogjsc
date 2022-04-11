import { useState, useEffect } from "react";
import auth from "../firebase/auth";
import db from "../firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const UseAuth = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [datos, setDatos] = useState(null);

  const obtenerDatos = async (dato) => {
    const consulta = await collection(db, "users");
    const q = await query(consulta, where("correo", "==", dato));
    const { docs } = await getDocs(q);
    const arreglo = docs.map((item) => ({ id: item.id, ...item.data() }));
    setDatos(arreglo[0]);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user);
        obtenerDatos(user.email);
      } else {
        setUsuario(null);
      }
      setLoading(false);
    });
  }, []);
  return {
    loading,
    usuario,
    datos,
  };
};

export default UseAuth;
