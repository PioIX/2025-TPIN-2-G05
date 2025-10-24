"use client"
import React, { useState } from "react";
import styles from "./Modal.module.css";
import Button from "@/Components/Button";

function ModalEleccion({ isOpen, onClose ,action, onClickEnviarSolicitudes, onClickVerSolicitudes, onClickAceptarSolicitudes}){
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
          <Button onClick={handleClose} className="buttonModalClose" text="X"> </Button>
        <div className={styles.modalContent}>
          <Button className="buttonModal" onClick = {onClickAceptarSolicitudes} text="Aceptar Solicitudes"> </Button>
          <Button onClick = {onClickEnviarSolicitudes} className = "buttonModal" text = "Enviar solicitudes"></Button>
        </div>
      </div>
    </>
  );
};

export default ModalEleccion;