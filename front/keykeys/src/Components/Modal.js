"use client"
import React, { useState } from "react";
import styles from "./Modal.module.css"; // Assuming we'll use CSS modules

const Modal = ({ isOpen, onClose, mensaje ,action}) => {
  if (!isOpen) return null; // Don't render the modal if it's not open
  function handleClose(){
    onClose();  // Cerrar el modal
    if (action) {
      action();  // Ejecutar la acción si existe
    }
  };
  return (
    <>
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <p>{mensaje}</p>
          <button onClick={handleClose}>Close Modal</button>
        </div>
      </div>
    </>
  );
};

export default Modal;

//Para usarlo tienen que:
// añadir esto en el medio del return
// {/* Modal Component */}
// <Modal isOpen={isModalOpen} onClose={closeModal} mensaje={modalMessage}/>
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
//abrirlo con openModal(texto,accion)