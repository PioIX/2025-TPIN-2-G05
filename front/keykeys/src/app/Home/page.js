"use client"

import Button from '@/Components/Button'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ImagenClick from '@/Components/ImagenClick'
import { infoUsuario, traerFotoUsuario, traerAmigos, traerTodosLosUsuarios, enviarSolicitud, traerSolicitudes } from '@/API/fetch'
import styles from './home.module.css'
import ModalInput from "@/Components/ModalInput"
import Modal from "@/Components/Modal"
import ModalEleccion from "@/Components/ModalEleccion"
import ModalAceptarSolicitudes from "@/Components/ModalAceptarSolicitudes"

export default function Home() {
  const [nombreUsuario, setNombreUsuario] = useState("")
  const [idUser, setIdUser] = useState(0)
  const [image, setImage] = useState("")
  const router = useRouter()
  const [amigos, setAmigos] = useState([])
  const [isModalInputOpen, setIsModalInputOpen] = useState(false);
  const [modalInputMessage, setModalInputMessage] = useState("");
  const [modalAction, setModalAction] = useState("");
  const [amigo, setAmigo] = useState("")
  const [solicitudes, setSolicitudes] = useState([])
  const [isModalEleccionOpen, setIsModalEleccionOpen] = useState(false);
  const [isModalAceptarSolicitudesOpen, setIsModalAceptarSolicitudesOpen] = useState(false);

  useEffect(() => {
    let id = localStorage.getItem("idUser")
    console.log("holaa ", id)
    setIdUser(id)
    fetchFotoUsuario(id)
    fetchDatosUsuario(id)
    fetchAmigos(id)
  }, [])

  useEffect(() =>{
    console.log(solicitudes)
  }, [solicitudes])


  const openModalInput = (mensaje) => {
    setModalInputMessage(mensaje);
    setIsModalInputOpen(true);       // Abre el modal
    setIsModalEleccionOpen(false);
  };

  const closeModalInput = () => {
    setIsModalInputOpen(false);  // Cierra el modal
  };

  const openModalEleccion = () => {
    setIsModalEleccionOpen(true); 
  }

  const closeModalEleccion = () =>{
    setIsModalEleccionOpen(false);  
  }

  async function fetchFotoUsuario(id) {
    let respond = await traerFotoUsuario(id)
    const bytes = respond.result.foto[0].foto.data
    const base64 = Buffer.from(bytes).toString("base64")
    const dataUrl = `data:image/png;base64,${base64}`
    setImage(dataUrl)
  }

  async function fetchDatosUsuario(id) {
    let respond = await infoUsuario(id)
    console.log("chauu", respond)
    setNombreUsuario(respond[0].nombre)
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
        }
      }
    } else {
      alert("El usuario ingresado no existe")
      setAmigo("")
      return;
    }
  }

  async function fetchTraerSolicitudes(){
    let respond = await traerSolicitudes(idUser)
    console.log(respond)
    setSolicitudes(respond.result)
  }

  async function fetchAmigos(id) {
    let respond = await traerAmigos(id)
    setAmigos(respond.result)
  }

  const handleChangeAmigo = (event) => {
    setAmigo(event.target.value)
  }

  const openModalSolicitudes = () =>{
    setIsModalAceptarSolicitudesOpen(true)
    setIsModalEleccionOpen(false)
    console.log("Solicitudes abiertas")
    fetchTraerSolicitudes()
  }

  function logOut() { router.replace("../") }

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
          {amigos ? amigos.map((amigo, index) => {
            return (
              <div key={index}><div className={styles.amigo}><img src={amigo.foto ? `data:image/png;base64,${Buffer.from(amigo.foto.data).toString("base64")}` : "/sesion.png"} />{amigo.nombre}</div></div>
            )
          }) : <p>No tiene amigos aún</p>}
        </div>

        <button className={styles.agregarButton} onClick={openModalEleccion}>AGREGAR</button>
      </div>

      <div className={styles.menuJuego}>
        <h1>KEY KEYS</h1>
        <button className={`${styles.mainButton} ${styles.join}`}>Unirse a una sala</button>
        <button className={`${styles.mainButton} ${styles.create}`}>Crear una sala</button>
        <button className={`${styles.mainButton} ${styles.config}`}>Configuración</button>
      </div>
      <ModalInput isOpen={isModalInputOpen} onClose={closeModalInput} mensaje={modalInputMessage} value={amigo} onChange={handleChangeAmigo} onClickAgregarAmigo={fetchInsertarSolicitud} />
      <ModalEleccion isOpen = {isModalEleccionOpen} onClose = {closeModalEleccion} onClickAceptarSolicitudes={openModalSolicitudes} onClickEnviarSolicitudes = {() => openModalInput("Ingrese el nombre de un usuario para enviarle una solicitud")}></ModalEleccion>
      <ModalAceptarSolicitudes isOpen={isModalAceptarSolicitudesOpen} onClose={() => setIsModalAceptarSolicitudesOpen(false)} estado={solicitudes}></ModalAceptarSolicitudes>
    </div>
  )
}