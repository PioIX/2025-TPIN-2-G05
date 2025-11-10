"use client"
import React, { useState, useEffect } from "react";
import styles from "./Modal.module.css";
import Button from "@/Components/Button";
import Input from "@/Components/Input";
import Person from "./Person";
import { useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket"
import { agregarAmigo, eliminarSolicitud, traerSolicitudes, traerPartidaPorCodigo } from "@/API/fetch";


function Modal({ isOpen, onClose, mensaje, action, aceptarSolicitud, eleccion, enviarSolicitudes, aceptarSolicitudes, input, onClickAgregar, value, onChange, onUpdate, jugadores, mensajePartidas, esModalPartidas, esLogout, esAdmin,admin,partidaTerminada}) {
  const [idUser, setIdUser] = useState(0)
  const [solicitudes, setSolicitudes] = useState([])
  const [codigoEntrada, setCodigoEntrada] = useState("")
  const router = useRouter()
  const { socket } = useSocket()

  useEffect(() => {
    let id = localStorage.getItem("idUser")
    setIdUser(id)
    fetchTraerSolicitudes(id)
  }, [])

  useEffect(() => {
    console.log(mensajePartidas)
  }, [mensajePartidas])

  async function fetchTraerSolicitudes(id) {
    let respond = await traerSolicitudes(id)
    setSolicitudes(respond.result)
  }

  const handleCodigoEntrada = (event) => {
    setCodigoEntrada(event.target.value)
  }

  function unirseASala(item) {
    localStorage.setItem("room", item.id_partida)
    router.push('/SalaEspera', { scroll: false })
  }

  async function checkCodigoEntrada() {
    let puedeEntrar = await traerPartidaPorCodigo(codigoEntrada)
    console.log(puedeEntrar.result)
    if (puedeEntrar.result.length > 0) {
      console.log("Puede entrar a la partida")
      localStorage.setItem("room", puedeEntrar.result[0].id_partida)
      router.push(`/SalaEspera`, { scroll: false })
    } else {
      alert("El código es incorrecto, no puede ingresar a la partida")
    }
  }


  async function onClickAceptar(item) {
    await agregarAmigo(idUser, item.id_usuario, item.id_solicitud)
    fetchTraerSolicitudes(idUser)
    onUpdate()
  }

  async function onClickRechazar(item) {
    let respond = await eliminarSolicitud(item.id_solicitud)
    fetchTraerSolicitudes(idUser)
  }

  if (!isOpen) return null; // Don't render the modal if it's not open
  function handleClose() {
    onClose();  // Cerrar el modal
    if (action) {
      console.log("ACCION MODAL")
      action.accion();  // Ejecutar la acción si existe
    }
  };

  function handleCloseLogout(){
    onClose();
    console.log("pipipi")
    if (action) {
      console.log("ACCION MODAL CIERRE")
      action.accion();  // Ejecutar la acción si existe
    }
  }

  function handleCloseCancel(){
    onClose();
  }


  return (
    <>
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          {aceptarSolicitud && (
            solicitudes.length > 0 ? (
              <>
                <h3 className={styles.subtitle}>Solicitudes</h3>
                {solicitudes.map((solicitud, index) => (
                  <div className={styles.solicitud} key={index}>
                    <p>Solicitud de <strong>{solicitud.nombre}</strong></p>
                    <Button
                      className="buttonModalAceptar"
                      onClick={() => onClickAceptar(solicitud)}
                      text="Aceptar"
                    />
                    <Button
                      className="buttonModalRechazar"
                      onClick={() => onClickRechazar(solicitud)}
                      text="Rechazar"
                    />
                  </div>
                ))}
              </>
            ) : <h1>No hay solicitudes que aceptar</h1>
          )
          }
          {
            eleccion && (
              <>
                <Button className="buttonModal" onClick={aceptarSolicitudes} text="Aceptar Solicitudes"> </Button>
                <Button onClick={enviarSolicitudes} className="buttonModal" text="Enviar solicitudes"></Button>
              </>
            )
          }
          {input && (
            <>
              <p>Ingrese el nombre de quien quieres agregar</p>
              <Input onChange={onChange} value={value} classNameInput={"inputModal"} classNameInputWrapper={"inputWrapperLogModal"}></Input>
              <Button className="buttonModal" onClick={onClickAgregar} text="Agregar amigo"></Button>
            </>
          )
          }
          <div className={styles.messageContainer}>
            <p>{mensaje}</p>
          </div>
          {/*Tabla de jugadores, utilizado solo en game */}
          {jugadores && (
            <div className={styles.tablaJugadores}>
              {jugadores.map((jugador, i) => {
                const src = jugador.foto
                  ? `data:image/png;base64,${Buffer.from(jugador.foto.data).toString("base64")}`
                  : "/sesion.png";

                return (
                  <div key={i} className={styles.filaJugador}>
                    <Person text={jugador.nombre} src={src} />
                    <p className={styles.puntosJugador}>{jugador.puntos} pts</p>
                  </div>
                );
              })}

              {admin === true && partidaTerminada == false && (
                <Button
                  onClick={handleClose}
                  className="buttonModal"
                  text="Iniciar siguiente ronda"
                />
              )}
              {partidaTerminada && (
                <Button
                  onClick={handleClose}
                  className="buttonModal"
                  text="Volver a la sala de espera"
                />
              )}
            </div>
          )}

          {Array.isArray(mensajePartidas) && esModalPartidas && (
            <>
              {mensajePartidas.length > 0 ? (
                <>
                  <span className={styles.span}>
                    Unirse a una partida
                  </span>
                  {mensajePartidas.map((partida) => (
                    <div key={partida.id_partida} className={styles.partidaItem}>
                      <span className={styles.codigoPartida}>
                        PARTIDA {partida.id_partida}  ADMIN: {partida.admin_nombre}
                      </span>
                      <Button onClick={() => { unirseASala(partida) }} className="chico" text="Unirse" />
                    </div>
                  ))}
                  <Input onChange={handleCodigoEntrada} value={codigoEntrada}></Input>
                  <Button onClick={checkCodigoEntrada} className={"buttonModal"} text={"Unirse con código"}></Button>
                </>
              ) : (
                <>
                  <span>No hay partidas activas de tus amigos</span>
                  <Input onChange={handleCodigoEntrada} value={codigoEntrada}></Input>
                  <Button onClick={checkCodigoEntrada} className={"buttonModal"} text={"Unirse con código"}></Button>
                </>
              )}
              <Button onClick={checkCodigoEntrada} className={"buttonModalCode"} text={"Unirse con código"}></Button>
            </>
          )}
          
          {esLogout && (
            <>
            <Button onClick={handleCloseLogout} className="buttonModal" text="Cerrar Sesión"> </Button>
            </>
            )}

          {esAdmin && (
            <>
            {/*usar una variable menu que sea "eliminar", "modificar" o "home" para determinar que submodal se abre*/}
            <Button onClick={modalAdminEliminar} className="buttonModal" text="Eliminar Usuario"> </Button>
            <Button onClick={modalAdminModificar} className="buttonModal" text="Modificar Usuario"> </Button>
            </>
          )}
          { admin ==null || esLogout==false&&
            <Button onClick={handleCloseCancel} className="buttonModal" text="Cancelar"> </Button>
          }
          
          

        </div>
      </div>
    </>
  );
};

export default Modal;

//Para usarlo tienen que:
// añadir esto en el medio del return
// {/* Modal Component */}
// <Modal
//   isOpen={isModalOpen}
//   onClose={closeModal}
//   mensaje={modalMessage}
//   action={modalAction || null} // Si modalAction está vacío, pasa null
// />
// poner esto arriba
// const [isModalOpen, setIsModalOpen] = useState(false);
// const [modalMessage, setModalMessage] = useState("");  // Estado para almacenar el mensaje
// const [modalAction, setModalAction] = useState("");  // Estado para poner una accion
// const openModal = (mensaje) => {
// setModalMessage(mensaje);
// setIsModalOpen(true);       // Abre el modal
// };
// function openModal(mensaje,action){
//   setModalMessage(mensaje);  // Establece el mensaje que se mostrará en el modal
//   setModalAction(action)     // pone accion q hace despues del cierre
//   setIsModalOpen(true);     // Abre el modal
// };
// const closeModal = () => {
// setIsModalOpen(false);  // Cierra el modal
// };
//abrirlo
// const accion = () => {router.replace('../Home', { scroll: false })};
// openModal("texto...",{accion: accion})