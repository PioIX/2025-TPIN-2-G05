"use client";

import Button from '@/Components/Button'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ImagenClick from '@/Components/ImagenClick'
import { infoUsuario, traerFotoUsuario, traerAmigos, traerTodosLosUsuarios, enviarSolicitud, traerSolicitudes,traerPartidasActivas} from '@/API/fetch'
import styles from './home.module.css'
import Modal from "@/Components/Modal"
import Person from '@/Components/Person'

export default function Home() {
  const [nombreUsuario, setNombreUsuario] = useState("")
  const [idUser, setIdUser] = useState(0)
  const [image, setImage] = useState("")
  const router = useRouter()
  const [amigos, setAmigos] = useState([])
  const [isModalEleccionOpen, setIsModalEleccionOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSolicitudesOpen, setIsModalAceptarSolicitudesOpen] = useState(false);
  const [isModalEnviarOpen, setIsModalEnviarOpen] = useState(false)
  const [amigo, setAmigo] = useState("")
  const [modalAction, setModalAction] = useState("")
  const [partidas, setPartidas] = useState([])


  useEffect(() => {
    let id = localStorage.getItem("idUser")
    console.log("holaa ", id)
    setIdUser(id)
    fetchFotoUsuario(id)
    fetchDatosUsuario(id)
    fetchAmigos(id)
    async function dataFetch(id) {
            let datos = await traerAmigos(id)
            console.log("amigoss", datos)
            setAmigos(datos)
            console.log("Datos de amigos recibidos:", datos)
            setAmigos(datos.result)
            console.log("Estado de amigos después de setear:", amigos)
        }
        dataFetch(id)
  }, [])
  
  
  const openModalEleccion = () => {
    setIsModalEleccionOpen(true)
    setIsModalOpen(true)
  }

  const closeModalEleccion = () => {
    setIsModalEleccionOpen(false);  // Cierra el modal
    setIsModalOpen(false);
    setIsModalAceptarSolicitudesOpen(false)
    setIsModalEnviarOpen(false)
  };

  const openModalSolicitudes = () => {
    setIsModalAceptarSolicitudesOpen(true)
    setIsModalEleccionOpen(false)
  }

  const openModalEnviar = () => {
    setIsModalEnviarOpen(true)
    setIsModalEleccionOpen(false)
  }

  async function fetchFotoUsuario(id) {
        let respond = await traerFotoUsuario(id)
        console.log("Respuesta foto usuario:", respond)

        if (!respond || !respond.result) {
            console.log("No hay datos de foto")
            return
        }

        try {
            let respond = await traerFotoUsuario(id)
            const bytes = respond.result.foto[0].foto.data
            const base64 = Buffer.from(bytes).toString("base64")
            const dataUrl = `data:image/png;base64,${base64}`
            setImage(dataUrl)   
        } catch (error) {
            console.error("Error procesando la foto:", error)
            setImage("")
        }
    }
  async function fetchDatosUsuario(id) {
    let respond = await infoUsuario(id)
    console.log("chauu", respond)
    setNombreUsuario(respond[0].nombre)
  }
    function logOut() { 
        router.replace("../") 
    }
  async function fetchInsertarSolicitud() {
    let respond = await traerTodosLosUsuarios()
    console.log("Estoy en la funcion")
    let usuarioExiste = respond.filter(res => res.nombre == amigo)
    if (usuarioExiste.length > 0) {
      let yaEsAmigo = amigos.find(friend => friend.nombre == amigo)
      if (yaEsAmigo) {
        alert("Este usuario ya es tu amigo, no puedes enviarle una solicitud a tu amigo")
        setAmigo("")
        return
      } else if (amigo == nombreUsuario) {
        alert("No te puede agregar a ti mismo como amigo")
      } else {
        let solicitudesDelOtroUsuario = await traerSolicitudes(usuarioExiste[0].id_usuario)
        let solicitudesMias = await traerSolicitudes(idUser)
        let solicitudFueEnviada = solicitudesDelOtroUsuario.result.find(sol => sol.id_usuario == idUser)
        let solicitudFueRecibida = solicitudesMias.result.find(sol => sol.id_usuario == usuarioExiste[0].id_usuario)
        if (solicitudFueEnviada || solicitudFueRecibida) {
          alert("El usuario ya tiene una solicitud de amistad tuya o tú una de él, no puedes mandarle otra")
          setAmigo("")
          return;
        } else {
          await enviarSolicitud(idUser, usuarioExiste[0].id_usuario)
          alert("Solicitud enviada")
        }
      }
    } else {
      setAmigo("")
      alert("El usuario ingresado no existe")
      return;
    }
  }
    const closeModal = () => {
        setIsModalOpen(false);
    };

    async function mostrarPartidas() {
        const partidasData = await traerPartidasActivas(idUser);
        setPartidas(partidasData.result || []);
        setModalMessage(
            <div className={styles.partidasList}>
                {partidasData.result && partidasData.result.length > 0 ? (
                    
                    partidasData.result.map((partida) => (
                        <div key={partida.id_partida} className={styles.partidaItem}>
                            <span className={styles.codigoPartida}> Partida {partida.id_partida} Usuario Admin: {partida.id_usuario_admin.nombre}</span>

                            <Button 
                                onClick={() => {
                                    console.log("Te toca Mati");
                            }}
                            text="Unirse"
                            className="joinGameButton"
                        />
                        </div>
                    ))
                ) : (
                    <span className={styles.noPartidas}>No hay partidas activas</span>
                )}
            </div>
        );
        setIsModalOpen(true);
    }
   async function fetchAmigos(id) {
    let respond = await traerAmigos(id)
    setAmigos(respond.result)
  }

  const handleChangeAmigo = (event) => {
    setAmigo(event.target.value)
  }

    return (
        <div className={styles.container}>
            <div className={styles.menuLateral}>
                <div className={styles.userSection}>
                              <img
            			src={image !== "data:image/png;base64," ? image : "/sesion.png"}
            			className={styles.userImage}
            			alt="Usuario"
          			/>
                    <h3 className={styles.userName}>{nombreUsuario}</h3>
                    <button className={styles.logoutButton} onClick={logOut}>
                        CERRAR SESIÓN
                    </button>
                </div>

                <h3>Amigos</h3>
                <div className={styles.menuAmigos}>
                    {amigos && amigos.length > 0 ? (
                        amigos.map((amigo) => {
                            console.log("Datos de amigo:", amigo)
                            return (
                                <Person
                                    key={amigo.id_usuario}
                                    nombre={amigo.nombre}
                                    foto={amigo.foto}
                                />
                            )
                        })
                    ) : (
                        <p>No hay amigos para mostrar</p>
                    )}
                </div>

                <button className={styles.agregarButton}>AGREGAR</button>
            </div>


            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                mensaje={modalMessage}
            />
        <button className={styles.agregarButton} onClick={openModalEleccion}>AGREGAR</button>
      </div>
      <div className={styles.menuJuego}>
          <h1>KEY KEYS</h1>
          <button className={`${styles.mainButton} ${styles.join}`} onClick={mostrarPartidas}>Unirse a una sala</button>
          <button className={`${styles.mainButton} ${styles.create}`}>Crear una sala</button>
          <button className={`${styles.mainButton} ${styles.config}`}>Configuración</button>
      </div>
      <Modal onUpdate={() => {fetchAmigos(idUser)}} eleccion={isModalEleccionOpen} aceptarSolicitud={isModalSolicitudesOpen} isOpen={isModalOpen} onClose={closeModalEleccion} mensaje={modalMessage} value={amigo} onChange={handleChangeAmigo} aceptarSolicitudes={openModalSolicitudes} enviarSolicitudes={openModalEnviar} input={isModalEnviarOpen} onClickAgregar={fetchInsertarSolicitud} />
    </div>
  )
}