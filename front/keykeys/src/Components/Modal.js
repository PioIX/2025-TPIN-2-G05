"use client"
import React, { useState } from "react";
import Person from "./Person";
import styles from "./Modal.module.css";
import Button from "@/Components/Button";

function Modal({ isOpen, onClose, mensaje ,action,jugadores}){
  if (!isOpen) return null; // Don't render the modal if it's not open
  function handleClose(){
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