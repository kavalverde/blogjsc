import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import auth from "../../firebase/auth";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import db from "../../firebase/firestore";
import { collection, addDoc } from "firebase/firestore";

const NuevoUsuario = (props) => {
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPaswword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  //Crear Publicación
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      nombre === "" ||
      email === "" ||
      password === "" ||
      confirmPaswword === ""
    ) {
      setError("Todos los campos son obligatorios");
    } else {
      if (password !== confirmPaswword) {
        setError("Las contraseñas no coinciden");
      } else {
        Swal.fire({
          title: "¿Estás seguro?",
          text: "No podrás realizar cambios en las credenciales de ingreso",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, crear cuenta",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const nuevoUsuario = {
                nombre,
                correo: email,
                tipo: "administrador",
              };
              await addDoc(collection(db, "users"), nuevoUsuario);
              await createUserWithEmailAndPassword(auth, email, password);
              await signOut(auth);
            } catch (error) {
              console.log(error);
            }
            Swal.fire({
              title: "Exito",
              icon: "success",
              text: "Cuenta creada con exito. Serás redirigido a la página de ingreso",
              showConfirmButton: false,
            });
            setTimeout(navigate("/Login"), 1500);
          }
        });
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
          <h3 className="mt-3">Nuevo usuario</h3>
          <div className="container-fluid">
            <form className="w-75" onSubmit={handleSubmit}>
              <div class="mb-3">
                <label class="form-label">Ingrese el nombre</label>
                <input
                  className="form-control"
                  id="nombre"
                  type="text"
                  placeholder="Ingrese nombre y apellido"
                  onChange={(e) => {
                    setNombre(e.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label class="form-label">Ingrese el correo</label>
                <input
                  className="form-control"
                  type="email"
                  id="email"
                  placeholder="Ingrese el correo electrónico"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label class="form-label">Ingrese la contraseña</label>
                <input
                  className="form-control"
                  type="password"
                  id="password"
                  placeholder="Ingrese la contraseña"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label class="form-label">Confirme la contraseña</label>
                <input
                  className="form-control"
                  type="password"
                  id="confirmPassword"
                  placeholder="Ingrese nuevamente la contraseña"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
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
                  value="Agregar nuevo usuario"
                />
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NuevoUsuario;
