"use client"
import React, { useState } from "react";
import styles from "./Modal.module.css";
import Button from "@/Components/Button";
import Input from "@/Components/Input";


function Modal({ isOpen, onClose, mensaje ,action,  aceptarSolicitud,estado,  eleccion,enviarSolicitudes,aceptarSolicitudes,  input,onClickAgregar,value,onChange}){
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
        {aceptarSolicitud && ( 
          estado.length > 0? estado.map((item, index) =>{
            return(
              <div className = {styles.solicitud}><p key = {index}> Solicitud de {item.nombre}</p>
                <Button className text = {"Aceptar"}></Button>
                <Button className = "button modal"text = {"Rechazar"}></Button>
                </div>
            )
          }):<h1>No hay solicitudes que aceptar</h1>
          )
        }
        {
          eleccion && (
          <>
            <Button className="buttonModal" onClick = {aceptarSolicitudes} text="Aceptar Solicitudes"> </Button>
            <Button onClick = {enviarSolicitudes} className = "buttonModal" text = "Enviar solicitudes"></Button>
          </>
          )
        }
        { input&&(
          <>
            <Input onChange = {onChange} value = {value} classNameInput={"inputModal"} classNameInputWrapper={"inputWrapperLogModal"}></Input>
            <Button className = "buttonModal" onClick = {onClickAgregar} text = "Agregar amigo"></Button>
          </>
          )
        }
          <p>{mensaje}</p>
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
//abrirlo
// const accion = () => {router.replace('../Home', { scroll: false })}; 
// openModal("texto...",{accion: accion})