"use client"
import React, { useState, useEffect } from "react";
import styles from "./Modal.module.css";
import Button from "@/Components/Button";
import Input from "@/Components/Input";
import { agregarAmigo, eliminarSolicitud, traerSolicitudes } from "@/API/fetch";


function Modal({ isOpen, onClose, mensaje, action, aceptarSolicitud, eleccion, enviarSolicitudes, aceptarSolicitudes, input, onClickAgregar, value, onChange, onUpdate, jugadores }) {
  const [idUser, setIdUser] = useState(0)
  const [solicitudes, setSolicitudes] = useState([])

  useEffect(() => {
    let id = localStorage.getItem("idUser")
    setIdUser(id)
    fetchTraerSolicitudes(id)
  }, [])

  useEffect(() => {
    console.log(idUser)
  }, [idUser])

  
  useEffect(() => {
    console.log(solicitudes)
  }, [solicitudes])


  async function fetchTraerSolicitudes(id) {
    let respond = await traerSolicitudes(id)
    console.log(respond)
    setSolicitudes(respond.result)
  }

  async function onClickAceptar(item) {
    let respond = await agregarAmigo(idUser, item.id_usuario, item.id_solicitud)
    console.log(respond)
    fetchTraerSolicitudes(idUser)
    onUpdate()
  }

  async function onClickRechazar(item) {
    let respond = await eliminarSolicitud(item.id_solicitud)
    console.log(respond)
    fetchTraerSolicitudes(idUser)
  }

  if (!isOpen) return null; // Don't render the modal if it's not open
  function handleClose() {
    onClose();  // Cerrar el modal
    if (action) {
      action.accion();  // Ejecutar la acción si existe
    }
  };
  return (
    <>
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={styles.modal}>
        <div className={styles.modalContent}>

          {aceptarSolicitud && (
            solicitudes.length > 0 ? (
              <>
                <h3 className = {styles.subtitle}>Solicitudes</h3>
                {solicitudes.map((solicitud, index) => (
                  <div className={styles.solicitud} key={index}>
                    <p>Solicitud de {solicitud.nombre}</p>
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
          <p>{mensaje}</p>

          {/*Tabla de jugadores, utilizado solo en game */}
          <div className={styles.tablaJugadores}>
            {jugadores.map((jugador, i) => (
              <div key={i} className={styles.filaJugador}>
                <Person text={jugador.nombre} image={jugador.foto}></Person>
                <p className={styles.puntosJugador}>{jugador.puntos} pts</p>
              </div>

            ))}
          </div>
          <Button onClick={handleClose} className="buttonModal" text="Close Modal"> </Button>
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