"use client";

import Button from "@/Components/Button";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import ImagenClick from "@/Components/ImagenClick";
import { infoUsuario, traerFotoUsuario, traerAmigos } from "@/API/fetch";
import styles from "./home.module.css";

export default function Home() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [idUser, setIdUser] = useState(0);
  const [image, setImage] = useState("");
  const router = useRouter();
  const [amigos, setAmigos] = useState([]);

  useEffect(() => {
    let id = localStorage.getItem("idUser");
    console.log("holaa ", id);
    setIdUser(id);
    fetchFotoUsuario(id);
    fetchDatosUsuario(id);
    async function dataFetch(id) {
      let datos = await traerAmigos(id);
        console.log("amigoss", datos);
      setAmigos(datos);
    }
    dataFetch(id);
  }, []);

//   useEffect(() => {
//     async function dataFetch(idUser) {
//       let datos = await traerAmigos(idUser);
//       console.log("MIERDA", idUser);
//         console.log("amigoss", datos);
//       setAmigos(datos);
//     }
//     dataFetch(idUser);
//   }, []);

  async function fetchFotoUsuario(id) {
    let respond = await traerFotoUsuario(id);
    const bytes = respond.result.foto[0].foto.data;
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;
    setImage(dataUrl);
  }

  async function fetchDatosUsuario(id) {
    let respond = await infoUsuario(id);
    console.log("chauu", respond);
    setNombreUsuario(respond[0].nombre);
  }

  function logOut() {
    router.replace("../");
  }

  return (
    <div className={styles.container}>
      <div className={styles.menuLateral}>
        <div className={styles.userSection}>
          {image && image !== "data:image/png;base64," ? (
            <img
              src={image}
              className={styles.userImage}
              alt="Usuario"
            />
          ) : (
            <img
              src="/sesion.png"
              className={styles.userImage}
              alt="Usuario"
            />
          )}
          <h3 className={styles.userName}>{nombreUsuario}</h3>
          <button className={styles.logoutButton} onClick={logOut}>
            CERRAR SESIÓN
          </button>
        </div>

        <h3>Amigos</h3>
        <div className={styles.menuAmigos}>
          {/* {usuarios.map((amigo) => (
            <ComponenteMagico
              key={usuario.id_usuario}
              id_usuario={usuario.id_usuario}
              email={usuario.email}
              contraseña={usuario.contraseña}
              nombre={usuario.nombre}
              foto={usuario.foto}
            />
          ))} */}
          <div className={styles.amigo}>
            <img src="/gunter.png" /> Gunter
          </div>
          <div className={styles.amigo}>
            <img src="/messi.png" /> Missi
          </div>
          <div className={styles.amigo}>
            <img src="/bob.png" /> Bob
          </div>
          <div className={styles.amigo}>
            <img src="/patricio.png" /> Patricio
          </div>
        </div>

        <button className={styles.agregarButton}>AGREGAR</button>
      </div>

      <div className={styles.menuJuego}>
        <h1>KEY KEYS</h1>
        <button className={`${styles.mainButton} ${styles.join}`}>
          Unirse a una sala
        </button>
        <button className={`${styles.mainButton} ${styles.create}`}>
          Crear una sala
        </button>
        <button className={`${styles.mainButton} ${styles.config}`}>
          Configuración
        </button>
      </div>
    </div>
  );
}
