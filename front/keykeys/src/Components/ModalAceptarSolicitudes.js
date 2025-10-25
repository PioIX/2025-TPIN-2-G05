"use client"
import React, { useState } from "react";
import styles from "./ModalAceptarSolicitudes.module.css";
import Button from "@/Components/Button";

function Modal({ isOpen, onClose ,action, estado}){
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
          <p>Solicitudes recibidas</p>
          {estado.length > 0? estado.map((item, index) =>{
            return(
              <div className = {styles.solicitud}><p key = {index}> Solicitud de {item.nombre}</p>
               <Button className text = {"Aceptar"}></Button>
               <Button className = "button modal"text = {"Rechazar"}></Button>
               </div>
            )
          }):<h1>No hay solicitudes que aceptar</h1>}
          <Button onClick={handleClose} className="buttonModal" text="Close Modal"> </Button>
        </div>
      </div>
    </>
  );
};

export default Modal;