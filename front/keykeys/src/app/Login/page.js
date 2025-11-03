"use client"
import Modal from "@/Components/Modal";
import ImagenClick from '@/Components/ImagenClick';
import stylesL from "./login.module.css";
import styles from "@/app/page.module.css";
import clsx from "clsx";
import Input from "@/Components/Input";
import { loguearUsuario } from "@/API/fetch";
import Button from "@/Components/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link"


export default function Home() {

  const [nombre, setNombre] = useState("");
  const [contraseña, setContraseña] = useState("");
  const router = useRouter()
  const [modalMessage, setModalMessage] = useState("");  
  const [modalAction, setModalAction] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  function openModal(mensaje,action){
    setModalMessage(mensaje);  
    setModalAction(action)
    setIsModalOpen(true);     
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  function ingresoNombre(event) {
    setNombre(event.target.value)
  }
  function ingresoContraseña(event) {
    setContraseña(event.target.value)
  }

  function volver(){
    router.push("/")
  }

  async function checkLogin() {
    if (contraseña == "" || nombre == "") {
      openModal("faltan rellenar campos")
    } else {
      let respond = await loguearUsuario(nombre, contraseña) //REEMPLAZAR CON EL FETCH CORRESPONDIENTE
      console.log(typeof(respond.result.id_usuario) == "string")
      typeof (respond.result.id_usuario == "string") && (respond.result.id_usuario = parseInt(respond.result.id_usuario))
      switch (respond.result.id_usuario) {
        case -2:
          openModal("Contraseña no coincide, reingrese")
          break
        case -1:
          openModal("Usuario inexistente, reingrese")
          break
        default:
          localStorage.setItem("idUser", respond.result[0].id_usuario)
          const accion = () => {router.replace('../Home', { scroll: false })}; 
          openModal("Ingresando...",{accion: accion})
          break
      }
    }

  }

  return (
    <>
      <div className={styles.container}>
        <ImagenClick src = {"/volver.png"} onClick={volver} className={styles.imagenClick}></ImagenClick>
        <h1 className={styles.title}>Keykeys</h1>
        <h2 className={styles.subtitle2}>Inicie sesión</h2 >
        <h3 className={styles.subtitle}>Ingrese su nombre y contraseña</h3>
        <div className={stylesL.containerInputs}>
          <Input placeholder="Ingrese su nombre..." id="nombre" onChange={ingresoNombre} classNameInput={"input"} classNameInputWrapper={"inputWrapperLog"}> </Input>
          <Input placeholder="Ingrese su contraseña..." id="contraseña" onChange={ingresoContraseña} classNameInput={"input"} classNameInputWrapper={"inputWrapperLog"} type="password"
          > </Input>
        </div>

        <Button type="button" onClick={checkLogin} text={"Iniciar sesion"} className={"buttonLog"}> </Button>
        <h4 className={styles.subtitle3}>¿No tiene cuenta? Registrarse ahora</h4>
        <div className={styles.containerLinks}>
          <Link href="/Registro" className={styles.irALaOtraPagina}>Registrarse</Link>
        </div>
      </div>
      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        mensaje={modalMessage}
        action={modalAction || null} // Si modalAction está vacío, pasa null
      />    
    </>
  );
}