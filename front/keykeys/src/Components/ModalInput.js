"use client"
import React, { useState } from "react";
import styles from "./ModalInput.module.css";
import Button from "@/Components/Button";
import Input from "@/Components/Input"
import { agregarAmigo } from "@/API/fetch";

function ModalInput({ isOpen, onClose, mensaje, action, value, onChange, onClickAgregarAmigo}){
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
          <Input onChange = {onChange} value = {value} classNameInput={"inputModal"} classNameInputWrapper={"inputWrapperLogModal"}></Input>
          <div className = {styles.block}>
          <Button className = "buttonModal" onClick = {onClickAgregarAmigo} text = "Agregar amigo"></Button>
          <Button onClick={handleClose} className="buttonModal" text="Cerrar Modal"> </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalInput;