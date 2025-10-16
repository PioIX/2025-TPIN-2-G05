"use client"
import React, { useState } from "react";
import styles from "./Modal.module.css"; // Assuming we'll use CSS modules

const Modal = ({ isOpen, onClose, mensaje }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <>
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <p>{mensaje}</p>
          <button onClick={onClose}>Close Modal</button>
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

// const openModal = (mensaje) => {
// setModalMessage(mensaje);  // Establece el mensaje que se mostrará en el modal
// setIsModalOpen(true);       // Abre el modal
// };

// const closeModal = () => {
// setIsModalOpen(false);  // Cierra el modal
// };
//abrirlo con openModal(texto)