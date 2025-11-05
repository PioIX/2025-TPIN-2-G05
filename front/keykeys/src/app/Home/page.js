"use client";

import Button from "@/Components/Button";
import Input from "@/Components/Input"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ImagenClick from "@/Components/ImagenClick";
import Modal from "@/Components/Modal";
import { useSocket } from "@/hooks/useSocket";
import { infoUsuario, traerFotoUsuario, traerAmigos, traerTodosLosUsuarios, enviarSolicitud, traerSolicitudes, traerPartidasActivasAmigos, crearPartida } from '@/API/fetch'
import styles from './home.module.css'
import Person from '@/Components/Person'


export default function Home() {
  const [nombreUsuario, setNombreUsuario] = useState("")
  const [idUser, setIdUser] = useState(0)
  const [image, setImage] = useState("")
  const router = useRouter()
  const [amigos, setAmigos] = useState([])
  const [isModalEleccionOpen, setIsModalEleccionOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalMessagePartidas, setModalMessagePartidas] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSolicitudesOpen, setIsModalAceptarSolicitudesOpen] = useState(false);
  const [isModalEnviarOpen, setIsModalEnviarOpen] = useState(false)
  const [amigo, setAmigo] = useState("")
  const [modalAction, setModalAction] = useState("")
  const [isModalPartidasOpen, setIsModalPartidasOpen] = useState(false)
  const [partidas, setPartidas] = useState([])
  const [codigoEntrada, setCodigoEntrada] = useState("")
  const { socket, isConnected } = useSocket()
  const [admin, setAdmin] = useState(false)
  const [booleanoLogout, setBooleanoLogout] = useState(false)
  const [booleanoAdmin, setBooleanoAdmin] = useState(false)
  function openModal(mensaje, action){
    setModalMessage(mensaje);
    setModalAction(action);
    setIsModalOpen(true);
  }

  useEffect(() => {
    //Aca van a ir los cambios si recibe una invitacion a la partida
  }, [socket])

  useEffect(() => {
    let id = localStorage.getItem("idUser")
    setIdUser(id)
    fetchFotoUsuario(id)
    fetchDatosUsuario(id)
    fetchAmigos(id)
    if(id==30){
      setAdmin(true)
    }
  }, [])

  async function fetchFotoUsuario(id) {
    let respond = await traerFotoUsuario(id);
    const bytes = respond.result.foto[0].foto.data; // Array de bytes obtenido de la base de datos
    // Se convierten los datos () a base64 con el objeto Buffer para poder renderizar la imagen, son los numeros que representan la imagen
    const base64 = Buffer.from(bytes).toString("base64"); //Lo pasa a un string entendible para renderizarlo

    // Se crea la data URl, que es el formato que usa HTML para representar imágenes

    const dataUrl = `data:image/png;base64,${base64}`; //Pense que el mymetype podia complicar las cosas al representar la imagen, pero no es el caso

    // Guardar el data URL en el estado
    setImage(dataUrl);
  }

  async function crearSala() {
    let id_partida = await crearPartida(idUser)
    console.log(id_partida.result.id_partida[0].id_partida)
    socket.emit("joinRoom", { room: id_partida.result.id_partida[0].id_partida, user: idUser })
    localStorage.setItem("idAdmin", idUser)
    localStorage.setItem("room", id_partida.result.id_partida[0].id_partida)
    setIsModalPartidasOpen(false)
    openModal("Creando sala...", router.push(`/SalaEspera`, { scroll: false }))
  }

  function openModalLogOut() { //CERRAR SESION - LOGOUT - CLOSE SESSION
    console.log("openModalLogOut")
    const accionDeCierre = () => {
      localStorage.setItem("idUser", null)
      router.push("..")
    };
    openModal("Estás seguro?", {accion: accionDeCierre})
    setBooleanoLogout(true)
  }
  
  function showConfiguracion() {
    console.log("Mostrando el modal de configuracion"); //<---ACÁ SE MUESTRA EL MODAL
  }

  const openModalEleccion = () => {
    setIsModalEleccionOpen(true)
    setIsModalPartidasOpen(false)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalEleccionOpen(false);  // Cierra el modal
    setIsModalOpen(false);
    setIsModalAceptarSolicitudesOpen(false)
    setIsModalEnviarOpen(false)
    setIsModalPartidasOpen(false)
    setBooleanoAdmin(false)
    setModalAction(null)
    setBooleanoLogout(false);
  };

  const openModalSolicitudes = () => {
    setIsModalAceptarSolicitudesOpen(true)
    setIsModalPartidasOpen(false)
    setIsModalEleccionOpen(false)
  }

  const openModalEnviar = () => {
    setIsModalPartidasOpen(false)
    setIsModalEnviarOpen(true)
    setIsModalEleccionOpen(false)
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
    setNombreUsuario(respond[0].nombre)
  }
  async function fetchInsertarSolicitud() {
    let respond = await traerTodosLosUsuarios()
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

  useEffect(()=>{
    console.log(partidas)
    console.log(partidas.length > 0)
  }, [partidas])

  async function mostrarPartidas() {
    const partidasData = await traerPartidasActivasAmigos(idUser);
    setPartidas(partidasData.result || []);
    setIsModalOpen(true);
    setIsModalPartidasOpen(true)
  }
  async function fetchAmigos(id) {
    let respond = await traerAmigos(id)
    setAmigos(respond.result)
  }

  const handleChangeAmigo = (event) => {
    setAmigo(event.target.value)
  }

  function openModalAdmin(){
    console.log("Se abrió el modalAdministrarUsuarios")
        const accionDeCierre = () => {
      localStorage.setItem("idUser", null)
      router.push("..")
    };
    openModal("Estás seguro?", {accion: accionDeCierre})
    setBooleanoAdmin(true)

  }













  
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.menuLateral}>
          <div className={styles.userSection}>
            <img
              src={
                image && image.length > "data:image/png;base64,".length
                  ? image
                  : "/sesion.png"
              }
              className={styles.userImage}
              alt="Usuario"
            />
            <h3 className={styles.userName}>{nombreUsuario}</h3>
            <button className={styles.logoutButton} onClick={openModalLogOut}>
              CERRAR SESIÓN
            </button>
          </div>

          <h3>Amigos</h3>
          <div className={styles.menuAmigos}>
            {amigos ? amigos.map((amigo, index) => {
              return (
                <div key={index}>
                  <Person
                    text={amigo.nombre}
                    src={amigo.foto ? `data:image/png;base64,${Buffer.from(amigo.foto.data).toString("base64")}` : "/sesion.png"}
                  />
                </div>)
            }) : <p>No tiene amigos aún</p>}
          </div>
          <button className={styles.agregarButton} onClick={openModalEleccion}>AGREGAR</button>
        </div>

        <div className={styles.menuJuego}>
          <h1>KEY KEYS</h1>
          <button className={`${styles.mainButton} ${styles.game}`} onClick={mostrarPartidas}>Unirse a una sala</button>
          <button className={`${styles.mainButton} ${styles.game}`} onClick={crearSala}>Crear una sala</button>
          <button className={`${styles.mainButton} ${styles.game}`}>Configuración</button>
          {admin &&<button className={`${styles.mainButton} ${styles.admin}`} onClick={openModalAdmin}>Administrar Usuarios</button>}
        </div>

        <Modal 
            onUpdate={() => { fetchAmigos(idUser) }} 
            eleccion={isModalEleccionOpen} 
            aceptarSolicitud={isModalSolicitudesOpen} 
            isOpen={isModalOpen} 
            onClose={closeModal} //ACCIONES DEL CIERRE DE SESION
            mensaje={modalMessage} 
            value={amigo} onChange={handleChangeAmigo} 
            aceptarSolicitudes={openModalSolicitudes} 
            enviarSolicitudes={openModalEnviar} 
            input={isModalEnviarOpen} 
            onClickAgregar={fetchInsertarSolicitud} 
            mensajePartidas={partidas} 
            esModalPartidas={isModalPartidasOpen}
            esLogout={booleanoLogout}
            action={modalAction}
            />
      </div>
    </div>
  )
}